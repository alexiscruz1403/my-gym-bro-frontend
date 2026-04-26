import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { LeaderboardResponse, MuscleRankItem } from '@/types/domain.types';
import type { LeaderboardParams, MuscleRanksParams } from '@/types/api.types';

export async function getMuscleRanks(params?: MuscleRanksParams): Promise<MuscleRankItem[]> {
  const { data } = await apiClient.get<MuscleRankItem[]>(API_ROUTES.ranks.muscles, { params });
  return data;
}

export async function getLeaderboard(params?: LeaderboardParams): Promise<LeaderboardResponse> {
  const { data } = await apiClient.get<LeaderboardResponse>(API_ROUTES.ranks.leaderboard, {
    params,
  });
  return data;
}
