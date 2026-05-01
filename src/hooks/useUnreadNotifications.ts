'use client';

import { useQuery } from '@tanstack/react-query';
import { getUnreadCount } from '@/services/notifications.service';
import useAuthStore from '@/store/auth.store';

export const UNREAD_COUNT_KEY = ['notifications', 'unread-count'] as const;

export function useUnreadNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data } = useQuery({
    queryKey: UNREAD_COUNT_KEY,
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
  });

  return { count: data?.count ?? 0 };
}
