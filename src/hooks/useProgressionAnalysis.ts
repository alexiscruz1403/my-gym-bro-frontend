'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { analyzeProgression } from '@/services/ai.service';
import type { ProgressionAnalysisResponse } from '@/types/domain.types';

export function useProgressionAnalysis(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => analyzeProgression(),
    onSuccess: (result: ProgressionAnalysisResponse) => {
      queryClient.setQueryData(['progression-current-week', planId], result);
    },
  });
}
