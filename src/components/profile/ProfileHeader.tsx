'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FollowButton } from '@/components/social/FollowButton';
import { FollowListSheet } from '@/components/social/FollowListSheet';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/store/auth.store';
import type { UserResponse, PublicUserProfile } from '@/types/domain.types';

// ─── Own profile mode ─────────────────────────────────────────────

interface OwnProfileHeaderProps {
  mode: 'own';
  user: UserResponse;
}

function OwnProfileHeader({ user }: OwnProfileHeaderProps) {
  const { t } = useTranslation();
  const [sheet, setSheet] = useState<'followers' | 'following' | null>(null);
  const [highlightUserId, setHighlightUserId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const followersParam = searchParams.get('followers');
    if (followersParam) {
      setSheet('followers');
      setHighlightUserId(followersParam);
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  return (
    <>
      <div className="flex items-start gap-4">
        <AvatarUpload />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-xl font-semibold truncate">{user.username}</h2>
            {user.membershipTier === 'premium' ? (
              <Badge className="shrink-0 bg-amber-500 text-white hover:bg-amber-500 border-0">
                {t('profile.membership.premium')}
              </Badge>
            ) : (
              <Badge variant="secondary" className="shrink-0">
                {t('profile.membership.free')}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setSheet('followers')}
              className="cursor-pointer text-sm text-left min-h-11 flex items-center"
            >
              <span className="font-semibold">{user.followersCount}</span>
              <span className="text-muted-foreground ml-1">{t('profile.followers')}</span>
            </button>
            <button
              onClick={() => setSheet('following')}
              className="cursor-pointer text-sm text-left min-h-11 flex items-center"
            >
              <span className="font-semibold">{user.followingCount}</span>
              <span className="text-muted-foreground ml-1">{t('profile.following')}</span>
            </button>
          </div>
        </div>
      </div>

      <FollowListSheet
        userId={user.id}
        type={sheet ?? 'followers'}
        open={sheet !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSheet(null);
            setHighlightUserId(null);
          }
        }}
        highlightUserId={highlightUserId}
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
  const { t } = useTranslation();
  const [sheet, setSheet] = useState<'followers' | 'following' | null>(null);
  const initials = user.username.slice(0, 2).toUpperCase();

  const isPrivateAndBlocked = user.isPrivate && !user.isFollowing;

  return (
    <>
      <div className="flex items-start gap-4">
        <Avatar size="lg">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-semibold truncate">{user.username}</h2>

          {isPrivateAndBlocked ? (
            <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>{t('profile.privateProfile')}</span>
            </div>
          ) : (
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setSheet('followers')}
                className="text-sm text-left min-h-11 flex items-center"
              >
                <span className="font-semibold">{user.followersCount}</span>
                <span className="text-muted-foreground ml-1">{t('profile.followers')}</span>
              </button>
              <button
                onClick={() => setSheet('following')}
                className="text-sm text-left min-h-11 flex items-center"
              >
                <span className="font-semibold">{user.followingCount}</span>
                <span className="text-muted-foreground ml-1">{t('profile.following')}</span>
              </button>
            </div>
          )}
        </div>

        <FollowButton
          userId={user._id}
          initialIsFollowing={user.isFollowing}
          initialIsRequestPending={user.isRequestPending}
        />
      </div>

      {!isPrivateAndBlocked && (
        <FollowListSheet
          userId={user._id}
          type={sheet ?? 'followers'}
          open={sheet !== null}
          onOpenChange={(open) => { if (!open) setSheet(null); }}
        />
      )}
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
