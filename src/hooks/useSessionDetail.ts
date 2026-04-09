'use client';

import { useQuery } from '@tanstack/react-query';
import { getSessionDetail } from '@/services/stats.service';

export function useSessionDetail(id: string) {
  const { data, isLoading, error, refetch: refetchQuery } = useQuery({
    queryKey: ['session', id],
    queryFn: () => getSessionDetail(id),
    enabled: !!id,
  });

  return {
    session: data ?? null,
    loading: isLoading,
    error: error ? 'Failed to load session' : null,
    refetch: () => { refetchQuery(); },
  };
}
