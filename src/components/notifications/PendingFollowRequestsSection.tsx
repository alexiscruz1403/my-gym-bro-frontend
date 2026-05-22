'use client';

import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { usePendingFollowRequests } from '@/hooks/usePendingFollowRequests';
import { PendingFollowRequestRow } from '@/components/notifications/PendingFollowRequestRow';

export function PendingFollowRequestsSection() {
  const { t } = useTranslation();
  const { requests, isLoading, isFetchingMore, hasMore, goToNextPage, approve, reject } =
    usePendingFollowRequests();

  if (isLoading) {
    return (
      <div className="mb-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-4 py-3">
          <Skeleton className="h-4 w-44 rounded" />
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 border-b border-border px-4 py-[11px] last:border-0"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1 rounded" />
            <div className="flex gap-1.5">
              <Skeleton className="h-[30px] w-16 rounded-full" />
              <Skeleton className="h-[30px] w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) return null;

  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="font-display text-[15px] font-semibold tracking-[0.02em] text-foreground">
          {t('followRequest.pendingTitle')}
        </p>
        <span className="min-w-5 rounded-full bg-destructive px-[7px] py-px text-center text-[11px] font-bold text-white">
          {requests.length}
        </span>
      </div>

      <div className="flex flex-col">
        {requests.map((req) => (
          <PendingFollowRequestRow
            key={req._id}
            request={req}
            onApprove={approve}
            onReject={reject}
          />
        ))}
      </div>

      {hasMore && (
        <div className="border-t border-border px-4 py-2.5">
          <button
            type="button"
            onClick={goToNextPage}
            disabled={isFetchingMore}
            className="w-full cursor-pointer text-center text-[12px] font-medium text-primary transition-colors hover:text-primary/80 disabled:opacity-50"
          >
            {isFetchingMore ? t('common.loading') : t('common.review')}
          </button>
        </div>
      )}
    </div>
  );
}
