'use client';

import { useFollow } from '@/hooks/useFollow';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
  initialIsRequestPending?: boolean;
  size?: 'sm' | 'default';
  onFollowed?: () => void;
}

export function FollowButton({
  userId,
  initialIsFollowing,
  initialIsRequestPending = false,
  size = 'default',
  onFollowed,
}: FollowButtonProps) {
  const { isFollowing, isRequestPending, isLoading, toggle } = useFollow(
    userId,
    initialIsFollowing,
    initialIsRequestPending,
    onFollowed,
  );

  let label: string;

  if (isFollowing) {
    label = '✓ Siguiendo';
  } else if (isRequestPending) {
    label = 'Solicitud enviada';
  } else {
    label = '+ Seguir';
  }

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={toggle}
      className={cn(
        'h-8 shrink-0 cursor-pointer rounded-full border-[1.5px] px-3.5 text-[12.5px] font-semibold transition-all disabled:opacity-50',
        isFollowing
          ? 'border-primary/25 bg-primary/10 text-primary hover:border-primary/40 hover:bg-primary/15'
          : isRequestPending
            ? 'border-border bg-muted text-muted-foreground'
            : 'border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary',
      )}
    >
      {label}
    </button>
  );
}
