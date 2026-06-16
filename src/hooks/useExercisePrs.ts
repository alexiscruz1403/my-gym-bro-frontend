'use client';

import { useQuery } from '@tanstack/react-query';
import { getExercisePrs } from '@/services/stats.service';

export function useExercisePrs(exerciseId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['exercise-prs', exerciseId],
    queryFn: () => getExercisePrs(exerciseId),
    enabled: !!exerciseId,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: !!error,
  };
}
