'use client';

import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { AdminPaymentLogRow } from './AdminPaymentLogRow';
import { useAdminPaymentLogs } from '@/hooks/useAdminPaymentLogs';
import type { SubscriptionPlan, SubscriptionStatus } from '@/types/domain.types';

const PLAN_OPTIONS: { value: SubscriptionPlan | ''; label: string }[] = [
  { value: '', label: 'All plans' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual' },
];

const STATUS_OPTIONS: { value: SubscriptionStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'authorized', label: 'Authorized' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'pending', label: 'Pending' },
  { value: 'payment_failed', label: 'Payment failed' },
];

export function AdminPaymentLogList() {
  const {
    logs,
    meta,
    page,
    isLoading,
    userId,
    plan,
    status,
    fetchPage,
    handleUserIdFilter,
    handlePlanFilter,
    handleStatusFilter,
  } = useAdminPaymentLogs();

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Input
          value={userId}
          onChange={(e) => handleUserIdFilter(e.target.value)}
          placeholder="Filter by user ID…"
          className="max-w-xs font-mono"
        />
        <select
          value={plan}
          onChange={(e) => handlePlanFilter(e.target.value as SubscriptionPlan | '')}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          {PLAN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => handleStatusFilter(e.target.value as SubscriptionStatus | '')}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && logs.length === 0 && (
        <p className="text-sm text-muted-foreground">No payment logs found.</p>
      )}

      {!isLoading && logs.length > 0 && (
        <div className="space-y-2">
          {logs.map((log) => (
            <AdminPaymentLogRow key={log._id} log={log} />
          ))}
        </div>
      )}

      {meta && (
        <Pagination page={page} total={meta.total} limit={meta.limit} onPageChange={fetchPage} />
      )}
    </div>
  );
}
