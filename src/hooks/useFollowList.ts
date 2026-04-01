'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFollowers, getFollowing } from '@/services/social.service';
import type { PublicUserSummary } from '@/types/domain.types';

interface FollowListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useFollowList(userId: string, type: 'followers' | 'following') {
  const [users, setUsers] = useState<PublicUserSummary[]>([]);
  const [meta, setMeta] = useState<FollowListMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    (targetPage: number) => {
      if (!userId) return;

      setIsLoading(true);
      setError(null);

      const fetcher = type === 'followers' ? getFollowers : getFollowing;

      fetcher(userId, { page: targetPage, limit: 20 })
        .then(({ data, meta: responseMeta }) => {
          setUsers(data);
          setMeta(responseMeta);
          setPage(targetPage);
        })
        .catch(() => setError('Failed to load list.'))
        .finally(() => setIsLoading(false));
    },
    [userId, type],
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  function goToPage(n: number) {
    fetchPage(n);
  }

  return { users, meta, page, isLoading, error, fetchPage, goToPage };
}
