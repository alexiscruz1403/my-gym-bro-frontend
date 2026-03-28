'use client';

import { AvatarUpload } from '@/components/profile/AvatarUpload';
import type { UserResponse } from '@/types/domain.types';

interface ProfileHeaderProps {
  user: UserResponse;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <AvatarUpload />

      <div className="flex-1 min-w-0">
        <h2 className="font-display text-xl font-semibold truncate">
          {user.username}
        </h2>
        <p className="text-sm text-muted-foreground truncate">{user.email}</p>

        <div className="flex gap-3 mt-2">
          <span className="text-sm">
            <span className="font-semibold">{user.followersCount}</span>{' '}
            <span className="text-muted-foreground">seguidores</span>
          </span>
          <span className="text-sm">
            <span className="font-semibold">{user.followingCount}</span>{' '}
            <span className="text-muted-foreground">siguiendo</span>
          </span>
        </div>
      </div>
    </div>
  );
}
