'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { followUser, unfollowUser } from '@/services/social.service';
import useAuthStore from '@/store/auth.store';

export function useFollow(userId: string, initialIsFollowing: boolean) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuthStore();

  async function toggle() {
    if (isLoading) return;

    const previous = isFollowing;
    const previousFollowingCount = user?.followingCount ?? 0;

    setIsFollowing(!previous);
    setIsLoading(true);

    // Optimistically update the authenticated user's followingCount in the store
    if (user) {
      setUser({ ...user, followingCount: previousFollowingCount + (previous ? -1 : 1) });
    }

    try {
      if (previous) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch {
      // Revert both local state and store count
      setIsFollowing(previous);
      if (user) {
        setUser({ ...user, followingCount: previousFollowingCount });
      }
      toast.error(previous ? 'Failed to unfollow.' : 'Failed to follow.');
    } finally {
      setIsLoading(false);
    }
  }

  return { isFollowing, isLoading, toggle };
}
