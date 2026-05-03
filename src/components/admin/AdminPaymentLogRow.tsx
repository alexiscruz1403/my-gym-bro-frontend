'use client';

import { Badge } from '@/components/ui/badge';
import type { PaymentLog, SubscriptionStatus } from '@/types/domain.types';

interface AdminPaymentLogRowProps {
  log: PaymentLog;
}

function statusVariant(s: SubscriptionStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (s) {
    case 'authorized':     return 'default';
    case 'paused':         return 'secondary';
    case 'payment_failed': return 'destructive';
    case 'cancelled':      return 'outline';
    case 'pending':        return 'secondary';
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function truncateId(id: string): string {
  return id.length > 16 ? `${id.slice(0, 8)}…${id.slice(-6)}` : id;
}

export function AdminPaymentLogRow({ log }: AdminPaymentLogRowProps) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3 space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</p>
          <p className="text-sm font-mono truncate" title={log.userId}>
            {truncateId(log.userId)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-xs capitalize">
            {log.plan}
          </Badge>
          <Badge variant={statusVariant(log.status)} className="text-xs">
            {log.status.replace('_', ' ')}
          </Badge>
          {log.amountArs != null && (
            <span className="text-xs text-muted-foreground">
              ARS {log.amountArs.toLocaleString()}
            </span>
          )}
          {log.orderNumber && (
            <span className="text-xs text-muted-foreground font-mono">
              #{log.orderNumber}
            </span>
          )}
          {log.failureCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {log.failureCount} failure{log.failureCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {log.error && (
        <p className="text-xs text-destructive break-words">{log.error}</p>
      )}
    </div>
  );
}
