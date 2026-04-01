'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { addReaction, removeReaction } from '@/services/feed.service';

export function usePostInteraction(
  postId: string,
  initialReacted: boolean,
  initialCount: number,
) {
  const [userReacted, setUserReacted] = useState(initialReacted);
  const [reactionsCount, setReactionsCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  async function toggle() {
    if (isLoading) return;

    const previousReacted = userReacted;
    const previousCount = reactionsCount;

    setUserReacted(!previousReacted);
    setReactionsCount(previousReacted ? previousCount - 1 : previousCount + 1);
    setIsLoading(true);

    try {
      const response = previousReacted
        ? await removeReaction(postId)
        : await addReaction(postId);
      setReactionsCount(response.reactionsCount);
    } catch {
      setUserReacted(previousReacted);
      setReactionsCount(previousCount);
      toast.error('Failed to update reaction.');
    } finally {
      setIsLoading(false);
    }
  }

  return { userReacted, reactionsCount, isLoading, toggle };
}
