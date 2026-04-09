'use client';

import { useQuery } from '@tanstack/react-query';
import { getActivePlan } from '@/services/workout-plans.service';

export function useActivePlan() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['active-plan'],
    queryFn: getActivePlan,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? 'Failed to load active plan' : null,
    refetch,
  };
}
