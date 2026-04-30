'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmProgression } from '@/services/ai.service';
import type { ConfirmProgressionRequest, ProgressionAnalysisResponse } from '@/types/domain.types';

export function useConfirmProgression(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ConfirmProgressionRequest) => confirmProgression(dto),
    onSuccess: (result: ProgressionAnalysisResponse) => {
      queryClient.setQueryData(['progression-current-week', planId], result);
      if (result.status === 'applied') {
        queryClient.invalidateQueries({ queryKey: ['plan', planId] });
      }
    },
  });
}
