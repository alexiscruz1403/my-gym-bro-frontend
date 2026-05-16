'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import type {
  MonitoringUsersResponse,
  MonitoringSubscriptionsResponse,
  MonitoringAiResponse,
  ErrorLog,
  PaginatedMeta,
} from '@/types/domain.types';

export function useMonitoringUsers() {
  const [data, setData] = useState<MonitoringUsersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(() => {
    setIsLoading(true);
    adminService
      .getMonitoringUsers()
      .then(setData)
      .catch(() => toast.error('Failed to load user stats.'))
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, fetch };
}

export function useMonitoringSubscriptions() {
  const [data, setData] = useState<MonitoringSubscriptionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(() => {
    setIsLoading(true);
    adminService
      .getMonitoringSubscriptions()
      .then(setData)
      .catch(() => toast.error('Failed to load subscription stats.'))
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, fetch };
}

export function useMonitoringAi() {
  const [data, setData] = useState<MonitoringAiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useCallback(() => {
    setIsLoading(true);
    adminService
      .getMonitoringAi()
      .then(setData)
      .catch(() => toast.error('Failed to load AI usage stats.'))
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, fetch };
}

export function useMonitoringErrors() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPage = useCallback((targetPage: number) => {
    setIsLoading(true);
    adminService
      .getMonitoringErrors(targetPage, 50)
      .then(({ data, meta: m }) => {
        setErrors(data);
        setMeta(m);
        setPage(targetPage);
      })
      .catch(() => toast.error('Failed to load error logs.'))
      .finally(() => setIsLoading(false));
  }, []);

  return { errors, meta, page, isLoading, fetchPage };
}
