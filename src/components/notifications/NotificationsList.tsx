'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationRow } from '@/components/notifications/NotificationRow';

export function NotificationsList() {
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
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar las notificaciones"
        description="Intenta de nuevo en unos segundos."
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No tienes notificaciones"
        description="Aquí aparecerán las novedades de la comunidad."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => markAllRead()}
          disabled={!hasUnread || isMarkingAll}
          className="cursor-pointer"
        >
          Marcar todas como leídas
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((n) => (
          <NotificationRow key={n._id} notification={n} onMarkRead={markRead} />
        ))}
      </div>

      <div ref={sentinelRef} />

      {isFetchingNextPage && (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}
    </div>
  );
}
