'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationRow } from '@/components/notifications/NotificationRow';

export function NotificationsList() {
  const { t } = useTranslation();
  const {
    items,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    markRead,
    markAllRead,
    isMarkingAll,
  } = useNotifications();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasUnread = items.some((n) => !n.isRead);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title={t('notifications.error.title')}
        description={t('notifications.error.description')}
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={t('notifications.empty.title')}
        description={t('notifications.empty.description')}
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Header: large title + mark-all */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[22px] font-bold tracking-[0.01em] text-foreground">
          {t('notifications.title')}
        </h2>
        <button
          type="button"
          onClick={() => markAllRead()}
          disabled={!hasUnread || isMarkingAll}
          className="h-7 cursor-pointer rounded-full border-[1.5px] border-border bg-transparent px-3 text-[11.5px] font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          {t('notifications.markAllRead')}
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {items.map((n) => (
          <NotificationRow key={n._id} notification={n} onMarkRead={markRead} />
        ))}
      </div>

      <div ref={sentinelRef} />

      {isFetchingNextPage && (
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      )}
    </div>
  );
}
