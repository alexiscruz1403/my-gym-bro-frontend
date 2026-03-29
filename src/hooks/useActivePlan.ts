'use client';

import { useState, useEffect, useCallback } from 'react';
import { getActivePlan } from '@/services/workout-plans.service';
import type { WorkoutPlan } from '@/types/domain.types';

export function useActivePlan() {
  const [data, setData] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getActivePlan();
      setData(result);
    } catch {
      setError('Failed to load active plan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
