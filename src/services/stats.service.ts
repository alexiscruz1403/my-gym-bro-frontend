import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
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

export async function getSessionHistory(
  params?: SessionHistoryParams,
): Promise<SessionHistoryResponse> {
  const { data } = await apiClient.get<SessionHistoryResponse>(API_ROUTES.sessions.history, {
    params,
  });
  return data;
}

export async function getSessionDetail(id: string): Promise<WorkoutSession> {
  const { data } = await apiClient.get<WorkoutSession>(API_ROUTES.sessions.detail(id));
  return data;
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
  const { data } = await apiClient.get<VolumeByPeriodResponse>(API_ROUTES.stats.volume, {
    params,
  });
  return data;
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
  const { data } = await apiClient.get<VolumeByMuscleResponse>(API_ROUTES.stats.muscles, {
    params,
  });
  return data;
}
