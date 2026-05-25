'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FollowButton } from '@/components/social/FollowButton';
import type { PublicUserSummary } from '@/types/domain.types';

interface UserListItemProps {
  user: PublicUserSummary;
  followersCount?: number;
  highlight?: boolean;
  onFollowed?: () => void;
}

export function UserListItem({ user, followersCount, highlight, onFollowed }: UserListItemProps) {
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
      className={`flex items-center gap-2.5 py-2.5 transition-colors ${
        highlight ? 'rounded-xl bg-primary/5 px-2 -mx-2' : ''
      }`}
    >
      <Link href={`/users/${user._id}`} className="shrink-0">
        <Avatar size="default">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </Link>

      <Link href={`/users/${user._id}`} className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold leading-tight truncate">@{user.username}</p>
        {followersCount !== undefined && (
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {followersCount.toLocaleString('es')} seguidores
          </p>
        )}
      </Link>

      <FollowButton
        userId={user._id}
        initialIsFollowing={user.isFollowing}
        size="sm"
        onFollowed={onFollowed}
      />
    </div>
  );
}
