'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSessionHistory } from '@/services/stats.service';

const DEFAULT_LIMIT = 10;

export function useSessionHistory() {
  const [page, setPage] = useState(1);

  const { data: result, isLoading, error, refetch: refetchQuery } = useQuery({
    queryKey: ['session-history', page],
    queryFn: () => getSessionHistory({ page, limit: DEFAULT_LIMIT }),
    placeholderData: (prev) => prev,
  });

  return {
    data: result?.data ?? [],
    meta: result?.meta ?? null,
    loading: isLoading,
    error: error ? 'Failed to load session history' : null,
    page,
    setPage,
    refetch: () => { refetchQuery(); },
  };
}
