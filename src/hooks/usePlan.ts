'use client';

import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { getPlan } from '@/services/workout-plans.service';

export function usePlan(id: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['plan', id],
    queryFn: () => getPlan(id),
    enabled: !!id,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? 'Failed to load plan' : null,
    refetch,
  };
}

export function invalidatePlanCache(id: string) {
  queryClient.invalidateQueries({ queryKey: ['plan', id] });
  queryClient.invalidateQueries({ queryKey: ['plans'] });
  queryClient.invalidateQueries({ queryKey: ['active-plan'] });
}
