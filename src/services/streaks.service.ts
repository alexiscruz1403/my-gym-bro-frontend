import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { StreakResponse } from '@/types/domain.types';

export async function getStreak(): Promise<StreakResponse> {
  const { data } = await apiClient.get<StreakResponse>(API_ROUTES.streaks.me);
  return data;
}
