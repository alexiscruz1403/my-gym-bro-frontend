'use client';

import { useQuery } from '@tanstack/react-query';
import { getExerciseRank } from '@/services/ranks.service';

export function useExerciseRank(exerciseId: string, enabled = true) {
  const { data, isLoading: loading, error } = useQuery({
    queryKey: ['ranks', 'exercise', exerciseId],
    queryFn: () => getExerciseRank(exerciseId),
    enabled: enabled && !!exerciseId,
  });

  return {
    data: data ?? null,
    loading,
    error: error ? 'Error al cargar el rango' : null,
  };
}
