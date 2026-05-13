'use client';

import { useMutation } from '@tanstack/react-query';
import { updatePlanGoals, type UpdatePlanGoalsRequest } from '@/services/workout-plans.service';
import { invalidatePlanCache } from '@/hooks/usePlan';

export function usePlanGoals(planId: string, onSuccess?: () => void) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: UpdatePlanGoalsRequest) => updatePlanGoals(planId, data),
    onSuccess: () => {
      invalidatePlanCache(planId);
      onSuccess?.();
    },
  });

  return { updateGoals: mutateAsync, isUpdating: isPending };
}
