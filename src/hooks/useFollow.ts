'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { followUser, unfollowUser, cancelFollowRequest } from '@/services/social.service';
import useAuthStore from '@/store/auth.store';

export function useFollow(
  userId: string,
  initialIsFollowing: boolean,
  initialIsRequestPending = false,
  onFollowed?: () => void,
) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isRequestPending, setIsRequestPending] = useState(initialIsRequestPending);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuthStore();

  async function toggle() {
    if (isLoading) return;
    setIsLoading(true);

    if (isFollowing) {
      const previousFollowingCount = user?.followingCount ?? 0;
      setIsFollowing(false);
      if (user) setUser({ ...user, followingCount: previousFollowingCount - 1 });

      try {
        await unfollowUser(userId);
      } catch {
        setIsFollowing(true);
        if (user) setUser({ ...user, followingCount: previousFollowingCount });
        toast.error('Error al dejar de seguir.');
      }
    } else if (isRequestPending) {
      setIsRequestPending(false);
      try {
        await cancelFollowRequest(userId);
      } catch {
        setIsRequestPending(true);
        toast.error('Error al cancelar la solicitud.');
      }
    } else {
      try {
        const result = await followUser(userId);
        if (result.pending) {
          setIsRequestPending(true);
        } else {
          const previousFollowingCount = user?.followingCount ?? 0;
          setIsFollowing(true);
          if (user) setUser({ ...user, followingCount: previousFollowingCount + 1 });
          onFollowed?.();
        }
      } catch {
        toast.error('Error al seguir.');
      }
    }

    setIsLoading(false);
  }

  return { isFollowing, isRequestPending, isLoading, toggle };
}
