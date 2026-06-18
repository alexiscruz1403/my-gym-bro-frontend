'use client';

import { useEffect, useRef } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getWsToken } from '@/services/notifications.service';
import { usersService } from '@/services/users.service';
import { formatNotification, hrefFor } from '@/lib/notification-format';
import { playNotification } from '@/lib/audio';
import useAuthStore from '@/store/auth.store';
import { useAchievementAnimationStore } from '@/store/achievement-animation.store';
import { useStreakRewardAnimationStore } from '@/store/streak-reward-animation.store';
import type { AppNotification, AchievementUnlockedPayload, StreakRewardUnlockedPayload, UserResponse } from '@/types/domain.types';
import type { ListNotificationsResponse } from '@/types/api.types';
import { NOTIFICATIONS_KEY } from '@/hooks/useNotifications';
import { UNREAD_COUNT_KEY } from '@/hooks/useUnreadNotifications';

export function useNotificationSocket() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const profileRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enqueueAchievement = useAchievementAnimationStore((s) => s.enqueue);
  const enqueueReward = useStreakRewardAnimationStore((s) => s.enqueue);

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

        type FollowUpdatePayload = {
          type: 'follow' | 'unfollow';
          followersCount?: number;
          followingCount?: number;
        };

        socket.on('follow_update', ({ followersCount, followingCount }: FollowUpdatePayload) => {
          const { user, setUser } = useAuthStore.getState();
          if (!user) return;
          const patch: Partial<UserResponse> = {};
          if (followersCount !== undefined) patch.followersCount = followersCount;
          if (followingCount !== undefined) patch.followingCount = followingCount;
          if (Object.keys(patch).length > 0) setUser({ ...user, ...patch });
        });

        socket.on('achievement_unlocked', (payload: AchievementUnlockedPayload) => {
          enqueueAchievement(payload);
          // Debounce: N simultaneous unlocks → single profile refresh
          if (profileRefreshTimerRef.current) clearTimeout(profileRefreshTimerRef.current);
          profileRefreshTimerRef.current = setTimeout(() => {
            usersService.getMe().then((userData) => {
              useAuthStore.getState().setUser(userData);
              queryClient.setQueryData(['profile'], userData);
            }).catch(() => { /* ignore — user can refresh manually */ });
          }, 300);
        });

        socket.on('streak_reward_unlocked', (payload: StreakRewardUnlockedPayload) => {
          enqueueReward(payload);
        });

        // Fetch a fresh token on disconnect so Socket.IO's automatic reconnection
        // attempts use valid credentials instead of the potentially-expired cached token.
        socket.on('disconnect', async () => {
          try {
            const fresh = await getWsToken();
            socket.auth = { token: fresh.token };
          } catch {
            // Keep old auth — reconnection will still attempt with the cached token
          }
        });

        // Only update socket.auth here; do NOT call socket.connect() manually as it
        // would race with Socket.IO's own reconnection loop.
        socket.on('connect_error', async (err) => {
          if (err.message?.toLowerCase().includes('unauthorized')) {
            try {
              const fresh = await getWsToken();
              socket.auth = { token: fresh.token };
            } catch {
              // fall through — polling from useUnreadNotifications still updates count
            }
          }
        });

        // After 5 failed reconnection attempts Socket.IO gives up permanently.
        // Tear down the dead socket and schedule a full reconnect every 60 s until
        // the backend is reachable again.
        socket.on('reconnect_failed', () => {
          socketRef.current?.removeAllListeners();
          socketRef.current?.disconnect();
          socketRef.current = null;

          retryTimerRef.current = setTimeout(() => {
            if (!cancelled) connect();
          }, 60_000);
        });

        socketRef.current = socket;
      } catch {
        // ws-token fetch failed — unread-count polling covers the fallback
      }
    }

    connect();

    return () => {
      cancelled = true;
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      if (profileRefreshTimerRef.current) clearTimeout(profileRefreshTimerRef.current);
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, queryClient, enqueueAchievement, enqueueReward]);
}
