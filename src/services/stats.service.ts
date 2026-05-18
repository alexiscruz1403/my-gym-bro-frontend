import axios from 'axios';
import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { db } from '@/lib/db';
import type {
  ExerciseHistoryResponse,
  ExerciseVolumeResponse,
  SessionHistoryResponse,
  VolumeByMuscleResponse,
  VolumeByPeriodResponse,
  WorkoutSession,
} from '@/types/domain.types';
import type {
  ExerciseHistoryParams,
  SessionHistoryParams,
  StatsMuscleParams,
  StatsVolumeParams,
} from '@/types/api.types';

function isNetworkError(error: unknown): boolean {
  return !navigator.onLine || (axios.isAxiosError(error) && !error.response);
}

export async function getSessionHistory(
  params?: SessionHistoryParams,
): Promise<SessionHistoryResponse> {
  try {
    const { data } = await apiClient.get<SessionHistoryResponse>(API_ROUTES.sessions.history, {
      params,
    });
    await db.sessionHistory.bulkPut(data.data);
    return data;
  } catch (error) {
    if (isNetworkError(error)) {
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 10;
      const all = await db.sessionHistory.orderBy('startedAt').reverse().toArray();
      const sliced = all.slice((page - 1) * limit, page * limit);
      return {
        data: sliced,
        meta: { total: all.length, page, limit, totalPages: Math.ceil(all.length / limit) },
      };
    }
    throw error;
  }
}

export async function getSessionDetail(id: string): Promise<WorkoutSession> {
  try {
    const { data } = await apiClient.get<WorkoutSession>(API_ROUTES.sessions.detail(id));
    await db.sessionDetails.put(data);
    return data;
  } catch (error) {
    if (isNetworkError(error)) {
      const cached = await db.sessionDetails.get(id);
      if (cached) return cached;
    }
    throw error;
  }
}

export async function getExerciseHistory(
  exerciseId: string,
  params?: ExerciseHistoryParams,
): Promise<ExerciseHistoryResponse> {
  const { data } = await apiClient.get<ExerciseHistoryResponse>(
    API_ROUTES.stats.exerciseHistory(exerciseId),
    { params },
  );
  return data;
}

export async function getVolumeByPeriod(
  params: StatsVolumeParams,
): Promise<VolumeByPeriodResponse> {
  const key = `volume_${params.period}_${params.date}`;
  try {
    const { data } = await apiClient.get<VolumeByPeriodResponse>(API_ROUTES.stats.volume, {
      params,
    });
    await db.statsCache.put({ key, type: 'volume', data, cachedAt: Date.now() });
    return data;
  } catch (error) {
    if (isNetworkError(error)) {
      const cached = await db.statsCache.get(key);
      if (cached) return cached.data as VolumeByPeriodResponse;
    }
    throw error;
  }
}

export async function getExerciseVolume(
  exerciseId: string,
  params: StatsVolumeParams,
): Promise<ExerciseVolumeResponse> {
  const { data } = await apiClient.get<ExerciseVolumeResponse>(
    API_ROUTES.stats.exerciseVolume(exerciseId),
    { params },
  );
  return data;
}

export async function getVolumeByMuscle(
  params: StatsMuscleParams,
): Promise<VolumeByMuscleResponse> {
  const key = `muscle_${params.period}_${params.date}`;
  try {
    const { data } = await apiClient.get<VolumeByMuscleResponse>(API_ROUTES.stats.muscles, {
      params,
    });
    await db.statsCache.put({ key, type: 'muscle', data, cachedAt: Date.now() });
    return data;
  } catch (error) {
    if (isNetworkError(error)) {
      const cached = await db.statsCache.get(key);
      if (cached) return cached.data as VolumeByMuscleResponse;
    }
    throw error;
  }
}
