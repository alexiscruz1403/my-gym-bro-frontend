'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFeed } from '@/services/feed.service';
import type { FeedFilter } from '@/types/api.types';
import type { FeedPost } from '@/types/domain.types';

interface FeedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useFeed(filter: FeedFilter = 'all') {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [meta, setMeta] = useState<FeedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    (targetPage: number) => {
      setIsLoading(true);
      setError(null);

      getFeed({ page: targetPage, limit: 20, filter })
        .then(({ data, meta: responseMeta }) => {
          setPosts(data);
          setMeta(responseMeta);
          setPage(targetPage);
        })
        .catch(() => setError('Failed to load feed.'))
        .finally(() => setIsLoading(false));
    },
    [filter],
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  function goToPage(n: number) {
    fetchPage(n);
  }

  function refresh() {
    fetchPage(1);
  }

  return { posts, meta, page, isLoading, error, goToPage, refresh };
}
