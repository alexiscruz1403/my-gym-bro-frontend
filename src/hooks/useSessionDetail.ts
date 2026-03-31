'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSessionDetail } from '@/services/stats.service';
import type { WorkoutSession } from '@/types/domain.types';

export function useSessionDetail(id: string) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSessionDetail(id);
      setSession(result);
    } catch {
      setError('Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  return { session, loading, error, refetch: fetch };
}
