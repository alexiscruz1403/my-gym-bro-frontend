'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { MonitoringUsersTab } from '@/components/admin/monitoring/MonitoringUsersTab';
import { MonitoringSubscriptionsTab } from '@/components/admin/monitoring/MonitoringSubscriptionsTab';
import { MonitoringAiTab } from '@/components/admin/monitoring/MonitoringAiTab';
import { MonitoringErrorsTab } from '@/components/admin/monitoring/MonitoringErrorsTab';

type MonTab = 'mon-users' | 'mon-subscriptions' | 'mon-ai' | 'mon-logs';

export function AdminMonitoringSection() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<MonTab>('mon-users');

  const TABS: { value: MonTab; label: string }[] = [
    { value: 'mon-users', label: t('monitoring.tabs.users') },
    { value: 'mon-subscriptions', label: t('monitoring.tabs.subscriptions') },
    { value: 'mon-ai', label: t('monitoring.tabs.ai') },
    { value: 'mon-logs', label: t('monitoring.tabs.logs') },
  ];

  return (
    <div className="flex flex-col gap-3.5">
      {/* Segment control */}
      <div className="bg-muted/60 rounded-2xl p-1 flex gap-0.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setTab(item.value)}
            className={cn(
              'flex-1 min-w-22.5 h-8.5 border-none rounded-xl text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap',
              tab === item.value
                ? 'bg-card text-foreground shadow-sm'
                : 'bg-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'mon-users' && <MonitoringUsersTab />}
      {tab === 'mon-subscriptions' && <MonitoringSubscriptionsTab />}
      {tab === 'mon-ai' && <MonitoringAiTab />}
      {tab === 'mon-logs' && <MonitoringErrorsTab />}
    </div>
  );
}
