import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { MuscleRecoveryItem } from '@/types/recovery.types';

interface MuscleRecoveryResponse {
  muscles: MuscleRecoveryItem[];
}

export async function getMuscleRecovery(): Promise<MuscleRecoveryItem[]> {
  const { data } = await apiClient.get<MuscleRecoveryResponse>(API_ROUTES.recovery.muscles);
  return data.muscles;
}
