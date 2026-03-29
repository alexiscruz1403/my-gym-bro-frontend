'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPlans } from '@/services/workout-plans.service';
import type { PlanListItem } from '@/types/domain.types';

export function usePlans() {
  const [data, setData] = useState<PlanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPlans();
      setData(result);
    } catch {
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
