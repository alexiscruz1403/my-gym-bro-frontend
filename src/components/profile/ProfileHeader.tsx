'use client';

import { useState } from 'react';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FollowButton } from '@/components/social/FollowButton';
import { FollowListSheet } from '@/components/social/FollowListSheet';
import useAuthStore from '@/store/auth.store';
import type { UserResponse, PublicUserProfile } from '@/types/domain.types';

// ─── Own profile mode ─────────────────────────────────────────────

interface OwnProfileHeaderProps {
  mode: 'own';
  user: UserResponse;
}

function OwnProfileHeader({ user }: OwnProfileHeaderProps) {
  const [sheet, setSheet] = useState<'followers' | 'following' | null>(null);

  return (
    <>
      <div className="flex items-start gap-4">
        <AvatarUpload />

        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-semibold truncate">{user.username}</h2>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setSheet('followers')}
              className="cursor-pointer text-sm text-left min-h-11 flex items-center"
            >
              <span className="font-semibold">{user.followersCount}</span>
              <span className="text-muted-foreground ml-1">followers</span>
            </button>
            <button
              onClick={() => setSheet('following')}
              className="cursor-pointer text-sm text-left min-h-11 flex items-center"
            >
              <span className="font-semibold">{user.followingCount}</span>
              <span className="text-muted-foreground ml-1">following</span>
            </button>
          </div>
        </div>
      </div>

      <FollowListSheet
        userId={user.id}
        type={sheet ?? 'followers'}
        open={sheet !== null}
        onOpenChange={(open) => { if (!open) setSheet(null); }}
      />
    </>
  );
}

// ─── Public profile mode ──────────────────────────────────────────

interface PublicProfileHeaderProps {
  mode: 'public';
  user: PublicUserProfile;
}

function PublicProfileHeader({ user }: PublicProfileHeaderProps) {
  const [sheet, setSheet] = useState<'followers' | 'following' | null>(null);
  const initials = user.username.slice(0, 2).toUpperCase();

  return (
    <>
      <div className="flex items-start gap-4">
        <Avatar size="lg">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-semibold truncate">{user.username}</h2>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setSheet('followers')}
              className="text-sm text-left min-h-11 flex items-center"
            >
              <span className="font-semibold">{user.followersCount}</span>
              <span className="text-muted-foreground ml-1">followers</span>
            </button>
            <button
              onClick={() => setSheet('following')}
              className="text-sm text-left min-h-11 flex items-center"
            >
              <span className="font-semibold">{user.followingCount}</span>
              <span className="text-muted-foreground ml-1">following</span>
            </button>
          </div>
        </div>

        <FollowButton userId={user._id} initialIsFollowing={user.isFollowing} />
      </div>

      <FollowListSheet
        userId={user._id}
        type={sheet ?? 'followers'}
        open={sheet !== null}
        onOpenChange={(open) => { if (!open) setSheet(null); }}
      />
    </>
  );
}

// ─── Unified export ───────────────────────────────────────────────

type ProfileHeaderProps =
  | { user: UserResponse }
  | { user: PublicUserProfile; userId: string };

export function ProfileHeader(props: ProfileHeaderProps) {
  const currentUser = useAuthStore((s) => s.user);

  if ('userId' in props) {
    const isOwnProfile = currentUser?.id === props.userId;

    if (isOwnProfile) {
      return <OwnProfileHeader mode="own" user={currentUser as UserResponse} />;
    }

    return <PublicProfileHeader mode="public" user={props.user as PublicUserProfile} />;
  }

  return <OwnProfileHeader mode="own" user={props.user as UserResponse} />;
}
