'use client';

import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { generatePlan } from '@/services/ai.service';
import type { GeneratePlanRequest, GeneratePlanResponse } from '@/types/domain.types';

export function useGeneratePlan(onSuccess?: (result: GeneratePlanResponse) => void) {
  return useMutation({
    mutationFn: (dto: GeneratePlanRequest) => generatePlan(dto),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['ai-profiles'] });
      onSuccess?.(result);
    },
  });
}
