'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPendingFollowRequests,
  approveFollowRequest,
  rejectFollowRequest,
} from '@/services/social.service';
import useAuthStore from '@/store/auth.store';
import type { FollowRequestItem } from '@/types/domain.types';

export const PENDING_REQUESTS_KEY = ['follow-requests', 'pending'] as const;

export function usePendingFollowRequests() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<FollowRequestItem[]>([]);

  const { data, isFetching } = useQuery({
    queryKey: [...PENDING_REQUESTS_KEY, page],
    queryFn: () => getPendingFollowRequests(page),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => {
      const existingIds = new Set(prev.map((r) => r._id));
      const newItems = data.data.filter((r) => !existingIds.has(r._id));
      return newItems.length > 0 ? [...prev, ...newItems] : prev;
    });
  }, [data]);

  const meta = data?.meta;
  const hasMore = meta ? page < meta.totalPages : false;

  function goToNextPage() {
    if (hasMore) setPage((p) => p + 1);
  }

  function removeFromAccumulated(senderId: string) {
    setAccumulated((prev) => prev.filter((r) => r.senderId !== senderId));
  }

  const { mutate: approve } = useMutation({
    mutationFn: approveFollowRequest,
    onMutate: (userId) => removeFromAccumulated(userId),
    onError: () => {
      queryClient.invalidateQueries({ queryKey: PENDING_REQUESTS_KEY });
      setPage(1);
      setAccumulated([]);
    },
  });

  const { mutate: reject } = useMutation({
    mutationFn: rejectFollowRequest,
    onMutate: (userId) => removeFromAccumulated(userId),
    onError: () => {
      queryClient.invalidateQueries({ queryKey: PENDING_REQUESTS_KEY });
      setPage(1);
      setAccumulated([]);
    },
  });

  return { requests: accumulated, isLoading: isFetching && page === 1, isFetchingMore: isFetching && page > 1, hasMore, goToNextPage, approve, reject };
}
