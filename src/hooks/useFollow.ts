'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { followUser, unfollowUser } from '@/services/social.service';

export function useFollow(userId: string, initialIsFollowing: boolean) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  async function toggle() {
    if (isLoading) return;

    const previous = isFollowing;
    setIsFollowing(!previous);
    setIsLoading(true);

    try {
      if (previous) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    } catch {
      setIsFollowing(previous);
      toast.error(previous ? 'Failed to unfollow.' : 'Failed to follow.');
    } finally {
      setIsLoading(false);
    }
  }

  return { isFollowing, isLoading, toggle };
}
