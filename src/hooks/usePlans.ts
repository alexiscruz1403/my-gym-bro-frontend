'use client';

import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { getPlans } from '@/services/workout-plans.service';

export function usePlans() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['plans'],
    queryFn: getPlans,
  });

  return {
    data: data ?? [],
    loading: isLoading,
    error: error ? 'Failed to load plans' : null,
    refetch,
  };
}

export function invalidatePlansCache() {
  queryClient.invalidateQueries({ queryKey: ['plans'] });
  queryClient.invalidateQueries({ queryKey: ['active-plan'] });
}
