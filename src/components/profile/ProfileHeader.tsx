'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FollowButton } from '@/components/social/FollowButton';
import { FollowListSheet } from '@/components/social/FollowListSheet';
import { cn } from '@/lib/utils';
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

  const isPremium = user.membershipTier === 'premium';

  return (
    <>
      <div className="flex items-start gap-[14px]">
        <AvatarUpload />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-[7px]">
            <h2 className="truncate font-display text-[22px] font-bold tracking-[0.01em] text-foreground">
              {user.username}
            </h2>
            <span className={cn(
              'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold',
              isPremium
                ? 'border-amber-500/30 bg-amber-500/15 text-amber-600'
                : 'border-border bg-muted text-muted-foreground',
            )}>
              {isPremium ? `✦ ${t('profile.membership.premium')}` : t('profile.membership.free')}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{user.email}</p>

          <div className="mt-2.5 flex gap-4">
            <button
              onClick={() => setSheet('followers')}
              className="flex cursor-pointer flex-col text-left transition-opacity hover:opacity-70"
            >
              <span className="font-display text-[18px] font-bold leading-none text-foreground">
                {user.followersCount}
              </span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">{t('profile.followers')}</span>
            </button>
            <button
              onClick={() => setSheet('following')}
              className="flex cursor-pointer flex-col text-left transition-opacity hover:opacity-70"
            >
              <span className="font-display text-[18px] font-bold leading-none text-foreground">
                {user.followingCount}
              </span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">{t('profile.following')}</span>
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
      <div className="flex items-start gap-[14px]">
        <Avatar size="lg">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-[22px] font-bold tracking-[0.01em] text-foreground">
            {user.username}
          </h2>

          {isPrivateAndBlocked ? (
            <div className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>{t('profile.privateProfile')}</span>
            </div>
          ) : (
            <div className="mt-2.5 flex gap-4">
              <button
                onClick={() => setSheet('followers')}
                className="flex cursor-pointer flex-col text-left transition-opacity hover:opacity-70"
              >
                <span className="font-display text-[18px] font-bold leading-none text-foreground">
                  {user.followersCount}
                </span>
                <span className="mt-0.5 text-[11px] text-muted-foreground">{t('profile.followers')}</span>
              </button>
              <button
                onClick={() => setSheet('following')}
                className="flex cursor-pointer flex-col text-left transition-opacity hover:opacity-70"
              >
                <span className="font-display text-[18px] font-bold leading-none text-foreground">
                  {user.followingCount}
                </span>
                <span className="mt-0.5 text-[11px] text-muted-foreground">{t('profile.following')}</span>
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
