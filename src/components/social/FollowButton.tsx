'use client';

import { useFollow } from '@/hooks/useFollow';
import { Button } from '@/components/ui/button';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
  initialIsRequestPending?: boolean;
  size?: 'sm' | 'default';
}

export function FollowButton({
  userId,
  initialIsFollowing,
  initialIsRequestPending = false,
  size = 'default',
}: FollowButtonProps) {
  const { isFollowing, isRequestPending, isLoading, toggle } = useFollow(
    userId,
    initialIsFollowing,
    initialIsRequestPending,
  );

  let label: string;
  let variant: 'default' | 'outline' | 'secondary';

  if (isFollowing) {
    label = 'Siguiendo';
    variant = 'default';
  } else if (isRequestPending) {
    label = 'Solicitud enviada';
    variant = 'secondary';
  } else {
    label = 'Seguir';
    variant = 'outline';
  }

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isLoading}
      onClick={toggle}
      className="cursor-pointer min-h-11 min-w-22"
    >
      {label}
    </Button>
  );
}
