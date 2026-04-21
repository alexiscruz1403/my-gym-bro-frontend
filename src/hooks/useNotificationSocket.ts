'use client';

import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getWsToken } from '@/services/notifications.service';
import { formatNotification, hrefFor } from '@/lib/notification-format';
import { playNotification } from '@/lib/audio';
import useAuthStore from '@/store/auth.store';
import type { AppNotification } from '@/types/domain.types';
import type { ListNotificationsResponse } from '@/types/api.types';
import { NOTIFICATIONS_KEY } from '@/hooks/useNotifications';
import { UNREAD_COUNT_KEY } from '@/hooks/useUnreadNotifications';

export function useNotificationSocket() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    async function connect() {
      try {
        const { token } = await getWsToken();
        if (cancelled) return;

        const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? '';
        const socket = io(`${wsUrl}/notifications`, {
          auth: { token },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 2000,
        });

        socket.on('notification', (n: AppNotification) => {
          queryClient.setQueryData<{
            pages: ListNotificationsResponse[];
            pageParams: unknown[];
          }>(NOTIFICATIONS_KEY, (old) => {
            if (!old || old.pages.length === 0) return old;
            const [first, ...rest] = old.pages;
            return {
              ...old,
              pages: [{ ...first, data: [n, ...first.data] }, ...rest],
            };
          });

          queryClient.setQueryData<{ count: number }>(UNREAD_COUNT_KEY, (prev) =>
            prev ? { count: prev.count + 1 } : { count: 1 },
          );

          playNotification();

          const formatted = formatNotification(n);
          toast(formatted.text, {
            action: {
              label: 'Ver',
              onClick: () => {
                if (typeof window !== 'undefined') {
                  window.location.href = hrefFor(n);
                }
              },
            },
          });
        });

        socket.on('connect_error', async (err) => {
          if (err.message?.toLowerCase().includes('unauthorized')) {
            try {
              const fresh = await getWsToken();
              socket.auth = { token: fresh.token };
              socket.connect();
            } catch {
              // fall through — polling from useUnreadNotifications still updates count
            }
          }
        });

        socketRef.current = socket;
      } catch {
        // ws-token fetch failed — unread-count polling covers the fallback
      }
    }

    connect();

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, queryClient]);
}
