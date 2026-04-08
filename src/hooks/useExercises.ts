'use client';

import { useQuery } from '@tanstack/react-query';
import { getExercises } from '@/services/exercises.service';
import type { ExerciseListParams } from '@/types/api.types';

const DEBOUNCE_MS = 300;

export function useExercises(params: ExerciseListParams = {}) {
  const { search, muscle, loadType, page = 1, limit = 20 } = params;

  const { data, isLoading, error } = useQuery({
    queryKey: ['exercises', { search, muscle, loadType, page, limit }],
    queryFn: () => getExercises({ search, muscle, loadType, page, limit }),
    placeholderData: (prev) => prev,
    // Debounce search queries by delaying staleTime only; actual debounce is
    // handled by keeping the same staleTime and relying on React re-renders.
    staleTime: search ? DEBOUNCE_MS : undefined,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? 'Failed to load exercises' : null,
  };
}
