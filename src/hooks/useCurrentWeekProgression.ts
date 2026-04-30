'use client';

import { useQuery } from '@tanstack/react-query';
import { getCurrentWeekProgression } from '@/services/ai.service';
import type { ProgressionAnalysisResponse } from '@/types/domain.types';

export function useCurrentWeekProgression(planId: string) {
  return useQuery<ProgressionAnalysisResponse | null>({
    queryKey: ['progression-current-week', planId],
    queryFn: async () => {
      const result = await getCurrentWeekProgression();
      if (result && result.planId !== planId) return null;
      return result;
    },
    staleTime: 1000 * 60 * 5,
  });
}
