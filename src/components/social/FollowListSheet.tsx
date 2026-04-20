'use client';

import { useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
  const { users, meta, page, isLoading, error, fetchPage, goToPage } = useFollowList(userId, type);

  useEffect(() => {
    if (open) fetchPage(1);
  }, [open, fetchPage]);

  const title = type === 'followers' ? 'Followers' : 'Following';

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80dvh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-6">
          {isLoading && <FollowListSkeletons />}

          {!isLoading && error && (
            <EmptyState
              title="Failed to load list"
              description="Could not fetch the list. Please try again."
            />
          )}

          {!isLoading && !error && users.length === 0 && (
            <EmptyState
              title={type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
            />
          )}

          {!isLoading && !error && users.length > 0 && (
            <div className="space-y-1">
              {users.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  highlight={highlightUserId === user._id}
                />
              ))}

              {meta && (
                <Pagination
                  page={page}
                  total={meta.total}
                  limit={meta.limit}
                  onPageChange={goToPage}
                />
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
