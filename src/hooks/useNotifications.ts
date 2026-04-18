'use client';

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/services/notifications.service';
import type { ListNotificationsResponse } from '@/types/api.types';
import { UNREAD_COUNT_KEY } from '@/hooks/useUnreadNotifications';
import useAuthStore from '@/store/auth.store';

export const NOTIFICATIONS_KEY = ['notifications', 'list'] as const;

const PAGE_LIMIT = 20;

export function useNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: NOTIFICATIONS_KEY,
    enabled: isAuthenticated,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) =>
      listNotifications({ limit: PAGE_LIMIT, cursor: pageParam }),
    getNextPageParam: (last: ListNotificationsResponse) => last.nextCursor ?? undefined,
  });

  const items = query.data?.pages.flatMap((p) => p.data) ?? [];

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });

      const previousList = queryClient.getQueryData(NOTIFICATIONS_KEY);
      const previousCount = queryClient.getQueryData<{ count: number }>(UNREAD_COUNT_KEY);

      queryClient.setQueryData<{
        pages: ListNotificationsResponse[];
        pageParams: unknown[];
      }>(NOTIFICATIONS_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
          })),
        };
      });

      const target = items.find((n) => n._id === id);
      if (target && !target.isRead) {
        queryClient.setQueryData<{ count: number }>(UNREAD_COUNT_KEY, (prev) =>
          prev ? { count: Math.max(0, prev.count - 1) } : prev,
        );
      }

      return { previousList, previousCount };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previousList) queryClient.setQueryData(NOTIFICATIONS_KEY, ctx.previousList);
      if (ctx?.previousCount) queryClient.setQueryData(UNREAD_COUNT_KEY, ctx.previousCount);
    },
  });

  const markAllRead = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.setQueryData<{
        pages: ListNotificationsResponse[];
        pageParams: unknown[];
      }>(NOTIFICATIONS_KEY, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((n) => ({ ...n, isRead: true })),
          })),
        };
      });
      queryClient.setQueryData(UNREAD_COUNT_KEY, { count: 0 });
    },
  });

  return {
    items,
    isLoading: query.isLoading,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage ?? false,
    isFetchingNextPage: query.isFetchingNextPage,
    markRead: markRead.mutate,
    markAllRead: markAllRead.mutate,
    isMarkingAll: markAllRead.isPending,
  };
}
