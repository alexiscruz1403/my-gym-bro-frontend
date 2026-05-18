import axios from 'axios';
import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { db } from '@/lib/db';
import type { ExerciseRankResponse, LeaderboardResponse, MuscleRankItem } from '@/types/domain.types';
import type { LeaderboardParams, MuscleRanksParams } from '@/types/api.types';

function isNetworkError(error: unknown): boolean {
  return !navigator.onLine || (axios.isAxiosError(error) && !error.response);
}

export async function getMuscleRanks(params?: MuscleRanksParams): Promise<MuscleRankItem[]> {
  try {
    const { data } = await apiClient.get<MuscleRankItem[]>(API_ROUTES.ranks.muscles, { params });
    await db.muscleRanks.bulkPut(data);
    return data;
  } catch (error) {
    if (isNetworkError(error)) {
      return db.muscleRanks.toArray();
    }
    throw error;
  }
}

export async function getLeaderboard(params?: LeaderboardParams): Promise<LeaderboardResponse> {
  const { data } = await apiClient.get<LeaderboardResponse>(API_ROUTES.ranks.leaderboard, {
    params,
  });
  return data;
}

export async function getExerciseRank(exerciseId: string): Promise<ExerciseRankResponse> {
  const { data } = await apiClient.get<ExerciseRankResponse>(
    API_ROUTES.ranks.exercise(exerciseId),
  );
  return data;
}
