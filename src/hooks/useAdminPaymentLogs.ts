'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import type { PaymentLog, PaginatedMeta, SubscriptionPlan, SubscriptionStatus } from '@/types/domain.types';

export function useAdminPaymentLogs() {
  const [logs, setLogs] = useState<PaymentLog[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState('');
  const [plan, setPlan] = useState<SubscriptionPlan | ''>('');
  const [status, setStatus] = useState<SubscriptionStatus | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchPage = useCallback(
    (
      targetPage: number,
      overrides?: {
        userId?: string;
        plan?: SubscriptionPlan | '';
        status?: SubscriptionStatus | '';
      },
    ) => {
      const u = overrides?.userId ?? userId;
      const p = overrides?.plan ?? plan;
      const s = overrides?.status ?? status;
      setIsLoading(true);
      adminService
        .listPaymentLogs({
          page: targetPage,
          limit: 20,
          userId: u || undefined,
          plan: (p as SubscriptionPlan) || undefined,
          status: (s as SubscriptionStatus) || undefined,
        })
        .then(({ data, meta: m }) => {
          setLogs(data);
          setMeta(m);
          setPage(targetPage);
        })
        .catch(() => toast.error('Failed to load payment logs.'))
        .finally(() => setIsLoading(false));
    },
    [userId, plan, status],
  );

  const handleUserIdFilter = (u: string) => {
    setUserId(u);
    fetchPage(1, { userId: u });
  };

  const handlePlanFilter = (p: SubscriptionPlan | '') => {
    setPlan(p);
    fetchPage(1, { plan: p });
  };

  const handleStatusFilter = (s: SubscriptionStatus | '') => {
    setStatus(s);
    fetchPage(1, { status: s });
  };

  return {
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
  };
}
