'use client';

import { useState, useEffect, useCallback } from 'react';
import { usersService } from '@/services/users.service';
import type { PublicSessionHistoryItem, PaginatedMeta } from '@/types/domain.types';

export function usePublicSessionHistory(userId: string) {
  const [sessions, setSessions] = useState<PublicSessionHistoryItem[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    (targetPage: number) => {
      if (!userId) return;
      setIsLoading(true);
      setError(null);
      usersService
        .getSessionHistory(userId, { page: targetPage, limit: 10 })
        .then(({ data, meta: responseMeta }) => {
          setSessions(data);
          setMeta(responseMeta);
          setPage(targetPage);
        })
        .catch(() => setError('Failed to load session history.'))
        .finally(() => setIsLoading(false));
    },
    [userId],
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  return { sessions, meta, page, isLoading, error, goToPage: fetchPage };
}
