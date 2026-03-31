'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSessionHistory } from '@/services/stats.service';
import type { SessionHistoryItem, PaginatedMeta } from '@/types/domain.types';

const DEFAULT_LIMIT = 10;

export function useSessionHistory() {
  const [data, setData] = useState<SessionHistoryItem[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSessionHistory({ page: targetPage, limit: DEFAULT_LIMIT });
      setData(result.data);
      setMeta(result.meta);
    } catch {
      setError('Failed to load session history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(page); }, [fetch, page]);

  const refetch = useCallback(() => fetch(page), [fetch, page]);

  return { data, meta, loading, error, page, setPage, refetch };
}
