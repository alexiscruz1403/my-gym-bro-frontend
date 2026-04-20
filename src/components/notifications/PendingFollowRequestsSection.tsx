'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePendingFollowRequests } from '@/hooks/usePendingFollowRequests';
import { PendingFollowRequestRow } from '@/components/notifications/PendingFollowRequestRow';

export function PendingFollowRequestsSection() {
  const { requests, isLoading, isFetchingMore, hasMore, goToNextPage, approve, reject } =
    usePendingFollowRequests();

  if (!isLoading && requests.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold mb-2 text-muted-foreground">
        Solicitudes de seguimiento{requests.length > 0 ? ` (${requests.length})` : ''}
      </h2>

      <div className="space-y-2">
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
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={isFetchingMore}
          className="mt-3 w-full cursor-pointer"
        >
          {isFetchingMore ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Cargando...
            </>
          ) : (
            'Mostrar más'
          )}
        </Button>
      )}
    </section>
  );
}
