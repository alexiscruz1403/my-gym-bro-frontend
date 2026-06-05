'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePlanAutoUpdate } from '@/services/workout-plans.service';
import type { WorkoutPlan } from '@/types/domain.types';

export function usePlanAutoUpdate(planId: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (autoUpdateWeight: boolean) =>
      updatePlanAutoUpdate(planId, autoUpdateWeight),
    onMutate: async (autoUpdateWeight) => {
      await queryClient.cancelQueries({ queryKey: ['plan', planId] });
      const previous = queryClient.getQueryData<WorkoutPlan>(['plan', planId]);
      queryClient.setQueryData<WorkoutPlan>(['plan', planId], (old) =>
        old ? { ...old, autoUpdateWeight } : old,
      );
      return { previous };
    },
    onError: (_err, _val, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['plan', planId], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['plan', planId] });
    },
  });

  return { toggle: mutate, isToggling: isPending };
}
