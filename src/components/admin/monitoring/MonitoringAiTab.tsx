'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, BarChart2, TrendingUp, TrendingDown, Minus, Copy, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMonitoringAi } from '@/hooks/useAdminMonitoring';
import type { AiUsageLog } from '@/types/domain.types';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  value: number | string;
  iconColor?: string;
  valueColor?: string;
}

function StatCard({ icon, label, sublabel, value, iconColor = 'text-muted-foreground', valueColor = 'text-foreground' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm flex flex-col gap-2">
      <div className={`flex items-center gap-1.5 ${iconColor}`}>
        {icon}
        <div>
          <p className="text-[12px] font-medium text-muted-foreground">{label}</p>
          {sublabel && <p className="text-[11px] text-muted-foreground">{sublabel}</p>}
        </div>
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

function UsageTable({ rows }: { rows: AiUsageLog[] }) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto [scrollbar-width:thin]">
      <table className="w-full border-collapse text-[12px] min-w-120">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('common.date')}</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('monitoring.ai.actionType')}</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('monitoring.ai.actor')}</th>
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
              <td className="px-3 py-2.5">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                  log.actionType === 'plan_generation'
                    ? 'bg-primary/10 text-primary border border-primary/25'
                    : 'bg-muted/60 text-muted-foreground border border-border'
                }`}>{t(`monitoring.values.${log.actionType}`)}</span>
              </td>
              <td className="px-3 py-2.5">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                  log.actor === 'user'
                    ? 'bg-primary/10 text-primary border border-primary/25'
                    : 'bg-muted/60 text-muted-foreground border border-border'
                }`}>{t(`monitoring.values.${log.actor}`)}</span>
              </td>
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

export function MonitoringAiTab() {
  const { t } = useTranslation();
  const { data, isLoading, fetch } = useMonitoringAi();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <StatCard
          icon={<Brain size={18} />}
          label={t('monitoring.ai.planGenerations')}
          sublabel={t('monitoring.ai.thisMonth')}
          value={data.planGenerationsThisMonth.toLocaleString()}
          iconColor="text-purple-500"
          valueColor="text-purple-600"
        />
        <StatCard
          icon={<BarChart2 size={18} />}
          label={t('monitoring.ai.progressionAnalyses')}
          sublabel={t('monitoring.ai.thisMonth')}
          value={data.progressionAnalysesThisMonth.toLocaleString()}
          iconColor="text-blue-500"
          valueColor="text-blue-600"
        />
        <MomCard
          label={t('monitoring.ai.momChange')}
          percent={data.momChangePercent}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-display text-[15px] font-semibold tracking-[0.01em] text-foreground">
            {t('monitoring.ai.recentUsages')}
          </h3>
        </div>
        {data.recentUsages.length === 0 ? (
          <p className="px-4 py-3.5 text-[13px] text-muted-foreground">{t('monitoring.ai.noUsages')}</p>
        ) : (
          <UsageTable rows={data.recentUsages} />
        )}
      </div>
    </div>
  );
}
