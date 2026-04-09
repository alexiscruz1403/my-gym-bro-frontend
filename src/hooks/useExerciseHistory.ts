'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExerciseHistory } from '@/services/stats.service';

const DEFAULT_LIMIT = 10;

export function useExerciseHistory(exerciseId: string) {
  const [page, setPage] = useState(1);

  const { data: result, isLoading, error, refetch: refetchQuery } = useQuery({
    queryKey: ['exercise-history', exerciseId, page],
    queryFn: () => getExerciseHistory(exerciseId, { page, limit: DEFAULT_LIMIT }),
    enabled: !!exerciseId,
    placeholderData: (prev) => prev,
  });

  return {
    data: result?.data ?? [],
    meta: result?.meta ?? null,
    loading: isLoading,
    error: error ? 'Failed to load exercise history' : null,
    page,
    setPage,
    refetch: () => { refetchQuery(); },
  };
}
