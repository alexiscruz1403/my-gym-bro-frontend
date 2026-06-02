'use client';

import { cn } from '@/lib/utils';
import type { PaymentLog, SubscriptionStatus } from '@/types/domain.types';

interface AdminPaymentLogRowProps {
  log: PaymentLog;
}

function statusClasses(s: SubscriptionStatus): string {
  switch (s) {
    case 'authorized':     return 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25';
    case 'pending':        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30';
    case 'payment_failed': return 'bg-destructive/10 text-destructive border border-destructive/25';
    case 'cancelled':      return 'bg-muted/60 text-muted-foreground border border-border';
    case 'paused':         return 'bg-muted/60 text-muted-foreground border border-border';
  }
}

function statusLabel(s: SubscriptionStatus): string {
  switch (s) {
    case 'authorized':     return 'Autorizado';
    case 'pending':        return 'Pendiente';
    case 'payment_failed': return 'Fallido';
    case 'cancelled':      return 'Cancelado';
    case 'paused':         return 'Pausado';
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
    <div className="bg-card border border-border rounded-2xl px-3.5 py-3 shadow-sm flex flex-col gap-1.5">
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{formatDate(log.createdAt)}</p>
          <p className="text-[13px] font-mono text-foreground font-medium truncate" title={log.userId}>
            {truncateId(log.userId)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="rounded-full text-[10px] font-semibold px-2 py-0.5 bg-muted/60 text-muted-foreground border border-border capitalize">
            {log.plan === 'monthly' ? 'Mensual' : 'Anual'}
          </span>
          <span className={cn('rounded-full text-[10px] font-semibold px-2 py-0.5', statusClasses(log.status))}>
            {statusLabel(log.status)}
          </span>
          {log.amountArs != null && (
            <span className="font-display text-[13px] font-semibold text-foreground">
              ARS {log.amountArs.toLocaleString()}
            </span>
          )}
          {log.orderNumber && (
            <span className="text-[11px] text-muted-foreground font-mono">#{log.orderNumber}</span>
          )}
          {log.failureCount > 0 && (
            <span className="rounded-full text-[10px] font-semibold px-2 py-0.5 bg-destructive/10 text-destructive border border-destructive/25">
              {log.failureCount} fallo{log.failureCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      {log.error && (
        <p className="text-[12px] text-destructive bg-destructive/10 rounded-lg px-2.5 py-1.5">{log.error}</p>
      )}
    </div>
  );
}
