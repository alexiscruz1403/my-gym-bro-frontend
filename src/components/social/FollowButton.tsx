'use client';

import { useFollow } from '@/hooks/useFollow';
import { Button } from '@/components/ui/button';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
  size?: 'sm' | 'default';
}

export function FollowButton({ userId, initialIsFollowing, size = 'default' }: FollowButtonProps) {
  const { isFollowing, isLoading, toggle } = useFollow(userId, initialIsFollowing);

  return (
    <Button
      variant={isFollowing ? 'default' : 'outline'}
      size={size}
      disabled={isLoading}
      onClick={toggle}
      className="min-h-[44px] min-w-[88px]"
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
