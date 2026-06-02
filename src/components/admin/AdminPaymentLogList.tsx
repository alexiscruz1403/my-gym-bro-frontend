'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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

  const selectCls = 'h-10 border-[1.5px] border-border rounded-2xl bg-card text-foreground text-[13px] px-2.5 outline-none cursor-pointer focus:border-primary transition-colors';

  return (
    <div className="flex flex-col gap-3">
      {/* Section head */}
      <div className="flex items-center justify-between gap-2.5">
        <span className="font-display text-[15px] font-semibold text-foreground tracking-[0.01em]">
          {t('admin.payments.title', { defaultValue: 'Historial de transacciones' })}
        </span>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        <input
          value={userId}
          onChange={(e) => handleUserIdFilter(e.target.value)}
          placeholder={t('admin.payments.userIdPlaceholder')}
          className="h-10 flex-1 min-w-40 border-[1.5px] border-border rounded-2xl bg-card text-foreground text-[13px] font-mono px-3 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/60 placeholder:font-sans"
        />
        <select
          value={plan}
          onChange={(e) => handlePlanFilter(e.target.value as SubscriptionPlan | '')}
          className={selectCls}
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
          className={selectCls}
        >
          {STATUS_VALUES.map((v) => (
            <option key={v} value={v}>
              {v === '' ? t('admin.payments.allStatuses') : t(`admin.payments.${v === 'payment_failed' ? 'paymentFailed' : v}`)}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && logs.length === 0 && (
        <p className="text-[13px] text-muted-foreground">{t('admin.payments.empty')}</p>
      )}

      {!isLoading && logs.length > 0 && (
        <div className="flex flex-col gap-2">
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
