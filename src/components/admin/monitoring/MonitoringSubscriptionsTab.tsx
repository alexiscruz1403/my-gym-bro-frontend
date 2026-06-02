'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, UserMinus, Calendar, CalendarDays, TrendingUp, TrendingDown, Minus, Copy, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
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
    <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm flex flex-col gap-2">
      <div className={`flex items-center gap-1.5 ${iconColor}`}>
        {icon}
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      </div>
      <p className={`font-display text-[28px] font-bold leading-none ${valueColor}`}>{value}</p>
    </div>
  );
}

function MomCard({ label, percent }: { label: string; percent: number | null }) {
  const { t } = useTranslation();

  if (percent === null) {
    return (
      <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Minus size={18} />
          <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
        </div>
        <p className="font-display text-[28px] font-bold leading-none text-muted-foreground">{t('monitoring.values.noData')}</p>
      </div>
    );
  }

  const isPositive = percent > 0;
  const isZero = percent === 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm flex flex-col gap-2">
      <div className={`flex items-center gap-1.5 ${isZero ? 'text-muted-foreground' : isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isZero ? <Minus size={18} /> : isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
        <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      </div>
      <p className={`font-display text-[28px] font-bold leading-none ${isZero ? 'text-foreground' : isPositive ? 'text-green-600' : 'text-red-600'}`}>
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
      className="cursor-pointer w-6.5 h-6.5 rounded-lg border-none bg-transparent flex items-center justify-center text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
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

function planBadge(plan: string, label: string) {
  const isPrimary = plan === 'monthly';
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
      isPrimary
        ? 'bg-primary/10 text-primary border border-primary/25'
        : 'bg-muted/60 text-muted-foreground border border-border'
    }`}>{label}</span>
  );
}

function actorBadge(actor: string, label: string) {
  const isUser = actor === 'user';
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
      isUser
        ? 'bg-primary/10 text-primary border border-primary/25'
        : 'bg-muted/60 text-muted-foreground border border-border'
    }`}>{label}</span>
  );
}

function typeBadge(type: string, label: string) {
  const isManual = type === 'manual';
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
      isManual
        ? 'bg-muted/60 text-muted-foreground border border-border'
        : 'bg-primary/10 text-primary border border-primary/25'
    }`}>{label}</span>
  );
}

function ActivationsTable({ rows }: { rows: SubscriptionActivationLog[] }) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto [scrollbar-width:thin]">
      <table className="w-full border-collapse text-[12px] min-w-120">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('common.date')}</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('monitoring.subscriptions.plan')}</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('monitoring.subscriptions.activationType')}</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('monitoring.subscriptions.amountPaid')}</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('monitoring.subscriptions.actor')}</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('monitoring.errors.user')}</th>
            <th className="w-10 px-2 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {rows.map((log) => (
            <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-3 py-2.5 whitespace-nowrap">
                <span className="text-[11px] font-mono text-muted-foreground">{formatDate(log.createdAt)}</span>
              </td>
              <td className="px-3 py-2.5">{planBadge(log.plan, t(`monitoring.values.${log.plan}`))}</td>
              <td className="px-3 py-2.5">{typeBadge(log.activationType, t(`monitoring.values.${log.activationType}`))}</td>
              <td className="px-3 py-2.5 font-semibold text-foreground whitespace-nowrap tabular-nums">
                ARS {log.amountPaid.toLocaleString()}
              </td>
              <td className="px-3 py-2.5">{actorBadge(log.actor, t(`monitoring.values.${log.actor}`))}</td>
              <td className="px-3 py-2.5 max-w-0">
                <span className="block truncate text-[11px] font-mono text-muted-foreground" title={log.userId}>
                  {log.userId}
                </span>
              </td>
              <td className="px-2 py-2.5 text-center"><CopyButton data={log} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
      <div className="flex flex-col gap-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
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

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-display text-[15px] font-semibold tracking-[0.01em] text-foreground">
            {t('monitoring.subscriptions.recentActivations')}
          </h3>
        </div>
        {data.recentActivations.length === 0 ? (
          <p className="px-4 py-3.5 text-[13px] text-muted-foreground">{t('monitoring.subscriptions.noActivations')}</p>
        ) : (
          <ActivationsTable rows={data.recentActivations} />
        )}
      </div>
    </div>
  );
}
