'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/shared/Pagination';
import { AdminPaymentLogRow } from './AdminPaymentLogRow';
import { useAdminPaymentLogs } from '@/hooks/useAdminPaymentLogs';
import type { SubscriptionPlan, SubscriptionStatus } from '@/types/domain.types';

const PLAN_VALUES: (SubscriptionPlan | '')[] = ['', 'monthly', 'annual'];
const STATUS_VALUES: (SubscriptionStatus | '')[] = ['', 'authorized', 'paused', 'cancelled', 'pending', 'payment_failed'];

export function AdminPaymentLogList() {
  const { t } = useTranslation();
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
          placeholder={t('admin.payments.userIdPlaceholder')}
          className="max-w-xs font-mono"
        />
        <select
          value={plan}
          onChange={(e) => handlePlanFilter(e.target.value as SubscriptionPlan | '')}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          {PLAN_VALUES.map((v) => (
            <option key={v} value={v}>
              {v === '' ? t('admin.payments.allPlans') : t(`admin.payments.${v}`)}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => handleStatusFilter(e.target.value as SubscriptionStatus | '')}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          {STATUS_VALUES.map((v) => (
            <option key={v} value={v}>
              {v === '' ? t('admin.payments.allStatuses') : t(`admin.payments.${v === 'payment_failed' ? 'paymentFailed' : v}`)}
            </option>
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
        <p className="text-sm text-muted-foreground">{t('admin.payments.empty')}</p>
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
