'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPlan } from '@/services/workout-plans.service';
import type { WorkoutPlan } from '@/types/domain.types';

export function usePlan(id: string) {
  const [data, setData] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getPlan(id);
      setData(result);
    } catch {
      setError('Failed to load plan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
