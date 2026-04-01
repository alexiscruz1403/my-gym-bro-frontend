'use client';

import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FollowButton } from '@/components/social/FollowButton';
import type { PublicUserSummary } from '@/types/domain.types';

interface UserListItemProps {
  user: PublicUserSummary;
}

export function UserListItem({ user }: UserListItemProps) {
  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center justify-between gap-3 py-2 min-h-[44px]">
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
