'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, UserMinus, Calendar, CalendarDays, TrendingUp, TrendingDown, Minus, Copy, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useMonitoringSubscriptions } from '@/hooks/useAdminMonitoring';
import type { SubscriptionActivationLog } from '@/types/domain.types';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  iconColor?: string;
  valueColor?: string;
}

function StatCard({ icon, label, value, iconColor = 'text-muted-foreground', valueColor = 'text-foreground' }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
      <div className={`flex items-center gap-2 ${iconColor}`}>
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

function MomCard({ label, percent }: { label: string; percent: number | null }) {
  const { t } = useTranslation();

  if (percent === null) {
    return (
      <div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Minus size={18} />
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <p className="text-3xl font-bold text-muted-foreground">{t('monitoring.values.noData')}</p>
      </div>
    );
  }

  const isPositive = percent > 0;
  const isZero = percent === 0;

  return (
    <div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
      <div className={`flex items-center gap-2 ${isZero ? 'text-muted-foreground' : isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isZero ? <Minus size={18} /> : isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${isZero ? 'text-foreground' : isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{percent.toFixed(1)}%
      </p>
    </div>
  );
}

function CopyButton({ data }: { data: object }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copiar como JSON"
      className="cursor-pointer p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function ActivationsTable({ rows }: { rows: SubscriptionActivationLog[] }) {
  const { t } = useTranslation();

  return (
    <table className="w-full table-fixed text-sm">
      <thead>
        <tr className="border-b bg-muted/40">
          <th className="w-[21%] px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{t('common.date')}</th>
          <th className="w-[12%] px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{t('monitoring.subscriptions.plan')}</th>
          <th className="w-[19%] px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{t('monitoring.subscriptions.activationType')}</th>
          <th className="w-[15%] px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{t('monitoring.subscriptions.amountPaid')}</th>
          <th className="w-[11%] px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{t('monitoring.subscriptions.actor')}</th>
          <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{t('monitoring.errors.user')}</th>
          <th className="w-10 px-2 py-2.5" />
        </tr>
      </thead>
      <tbody>
        {rows.map((log) => (
          <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
            <td className="max-w-0 px-3 py-3">
              <span className="block truncate text-xs text-muted-foreground" title={new Date(log.createdAt).toLocaleString()}>
                {formatDate(log.createdAt)}
              </span>
            </td>
            <td className="px-3 py-3">
              <Badge variant={log.plan === 'monthly' ? 'default' : 'secondary'}>
                {t(`monitoring.values.${log.plan}`)}
              </Badge>
            </td>
            <td className="px-3 py-3">
              <Badge variant={log.activationType === 'manual' ? 'outline' : 'secondary'}>
                {t(`monitoring.values.${log.activationType}`)}
              </Badge>
            </td>
            <td className="px-3 py-3 font-medium tabular-nums">
              ARS {log.amountPaid.toLocaleString()}
            </td>
            <td className="px-3 py-3">
              <Badge variant={log.actor === 'user' ? 'default' : 'outline'}>
                {t(`monitoring.values.${log.actor}`)}
              </Badge>
            </td>
            <td className="max-w-0 px-3 py-3">
              <span className="block truncate text-xs text-muted-foreground font-mono" title={log.userId}>
                {log.userId}
              </span>
            </td>
            <td className="px-2 py-3 text-center">
              <CopyButton data={log} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function MonitoringSubscriptionsTab() {
  const { t } = useTranslation();
  const { data, isLoading, fetch } = useMonitoringSubscriptions();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<CreditCard size={18} />}
          label={t('monitoring.subscriptions.total')}
          value={data.totalSubscriptions.toLocaleString()}
          iconColor="text-primary"
          valueColor="text-primary"
        />
        <StatCard
          icon={<UserMinus size={18} />}
          label={t('monitoring.subscriptions.stoppedRenewing')}
          value={data.stoppedRenewing.toLocaleString()}
          iconColor="text-red-500"
          valueColor="text-red-600"
        />
        <StatCard
          icon={<Calendar size={18} />}
          label={t('monitoring.subscriptions.activeMonthly')}
          value={data.activeMonthly.toLocaleString()}
          iconColor="text-blue-500"
          valueColor="text-blue-600"
        />
        <StatCard
          icon={<CalendarDays size={18} />}
          label={t('monitoring.subscriptions.activeAnnual')}
          value={data.activeAnnual.toLocaleString()}
          iconColor="text-purple-500"
          valueColor="text-purple-600"
        />
        <MomCard
          label={t('monitoring.subscriptions.momChange')}
          percent={data.momChangePercent}
        />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold">{t('monitoring.subscriptions.recentActivations')}</h3>
        </div>
        {data.recentActivations.length === 0 ? (
          <p className="px-5 py-4 text-sm text-muted-foreground">{t('monitoring.subscriptions.noActivations')}</p>
        ) : (
          <ActivationsTable rows={data.recentActivations} />
        )}
      </div>
    </div>
  );
}
