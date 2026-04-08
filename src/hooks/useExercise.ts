'use client';

import { useQuery } from '@tanstack/react-query';
import { getExercise } from '@/services/exercises.service';

export function useExercise(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['exercise', id],
    queryFn: () => getExercise(id),
    enabled: !!id,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? 'Failed to load exercise' : null,
  };
}
