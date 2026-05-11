'use client';

import { useMutation } from '@tanstack/react-query';
import { copyAiPlan } from '@/services/ai.service';
import { invalidatePlansCache } from '@/hooks/usePlans';
import type { WorkoutPlan } from '@/types/domain.types';

export function useCopyAiPlan(onSuccess?: (plan: WorkoutPlan) => void) {
  const { mutate, isPending } = useMutation({
    mutationFn: (planId: string) => copyAiPlan(planId),
    onSuccess: (plan) => {
      invalidatePlansCache();
      onSuccess?.(plan);
    },
  });
  return { copy: mutate, isCopying: isPending };
}
