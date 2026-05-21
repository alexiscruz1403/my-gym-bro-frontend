'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { UserListItem } from '@/components/social/UserListItem';
import { useFollowList } from '@/hooks/useFollowList';

function FollowListSkeletons() {
  return (
    <div className="space-y-2 px-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

interface FollowListSheetProps {
  userId: string;
  type: 'followers' | 'following';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  highlightUserId?: string | null;
}

export function FollowListSheet({
  userId,
  type,
  open,
  onOpenChange,
  highlightUserId,
}: FollowListSheetProps) {
  const { t } = useTranslation();
  const { users, meta, page, isLoading, error, fetchPage, goToPage } = useFollowList(userId, type);

  useEffect(() => {
    if (open) fetchPage(1);
  }, [open, fetchPage]);

  const title = type === 'followers'
    ? t('profile.followList.followers')
    : t('profile.followList.following');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="flex max-h-[80dvh] flex-col rounded-t-[20px] border-0 p-0"
      >
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-border" />

        <div className="shrink-0 px-5 pb-3 pt-4">
          <SheetTitle className="font-display text-[19px] font-bold tracking-[0.02em]">
            {title}
          </SheetTitle>
          <SheetDescription className="sr-only">{title}</SheetDescription>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          {isLoading && <FollowListSkeletons />}

          {!isLoading && error && (
            <div className="px-4">
              <EmptyState
                title={t('profile.followList.error.title')}
                description={t('profile.followList.error.description')}
              />
            </div>
          )}

          {!isLoading && !error && users.length === 0 && (
            <div className="px-4">
              <EmptyState
                title={
                  type === 'followers'
                    ? t('profile.followList.emptyFollowers')
                    : t('profile.followList.emptyFollowing')
                }
              />
            </div>
          )}

          {!isLoading && !error && users.length > 0 && (
            <div className="space-y-1 px-4">
              {users.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  highlight={highlightUserId === user._id}
                />
              ))}

              {meta && (
                <div className="mt-2">
                  <Pagination
                    page={page}
                    total={meta.total}
                    limit={meta.limit}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
