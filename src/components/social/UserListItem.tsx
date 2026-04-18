'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FollowButton } from '@/components/social/FollowButton';
import type { PublicUserSummary } from '@/types/domain.types';

interface UserListItemProps {
  user: PublicUserSummary;
  highlight?: boolean;
}

export function UserListItem({ user, highlight }: UserListItemProps) {
  const initials = user.username.slice(0, 2).toUpperCase();
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlight && rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlight]);

  return (
    <div
      ref={rowRef}
      className={`flex items-center justify-between gap-3 py-2 min-h-[44px] rounded-md px-2 -mx-2 transition-colors ${
        highlight ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
    >
      <Link
        href={`/users/${user._id}`}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <Avatar size="default">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium truncate">{user.username}</span>
      </Link>

      <FollowButton
        userId={user._id}
        initialIsFollowing={user.isFollowing}
        size="sm"
      />
    </div>
  );
}
