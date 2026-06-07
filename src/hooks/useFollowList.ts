'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFollowers, getFollowing } from '@/services/social.service';
import type { PublicUserSummary } from '@/types/domain.types';
import type { PaginationParams } from '@/types/api.types';

interface FollowListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useFollowList(
  userId: string,
  type: 'followers' | 'following',
  options?: { limit?: number; search?: string },
) {
  const limit = options?.limit ?? 20;
  const search = options?.search?.trim() ?? '';

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
      const params: PaginationParams = { page: targetPage, limit };
      if (search) params.username = search;

      fetcher(userId, params)
        .then(({ data, meta: responseMeta }) => {
          setUsers(data);
          setMeta(responseMeta);
          setPage(targetPage);
        })
        .catch(() => setError('Failed to load list.'))
        .finally(() => setIsLoading(false));
    },
    [userId, type, limit, search],
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  function goToPage(n: number) {
    fetchPage(n);
  }

  return { users, meta, page, isLoading, error, fetchPage, goToPage };
}
