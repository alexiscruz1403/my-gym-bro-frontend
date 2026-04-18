'use client';

import { useNotificationSocket } from '@/hooks/useNotificationSocket';

export function NotificationsProvider() {
  useNotificationSocket();
  return null;
}
