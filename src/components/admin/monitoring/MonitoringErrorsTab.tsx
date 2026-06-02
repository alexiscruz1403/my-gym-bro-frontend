'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useMonitoringErrors } from '@/hooks/useAdminMonitoring';
import type { ErrorLog } from '@/types/domain.types';

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

function ErrorsTable({ rows }: { rows: ErrorLog[] }) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto [scrollbar-width:thin]">
      <table className="w-full border-collapse text-[12px] min-w-120">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('common.date')}</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('monitoring.errors.code')}</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('monitoring.errors.endpoint')}</th>
            <th className="text-left px-3 py-2.5 text-[11px] font-semibold text-muted-foreground tracking-[0.02em] whitespace-nowrap">{t('monitoring.errors.message')}</th>
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
                  log.statusCode >= 500
                    ? 'bg-destructive/10 text-destructive border border-destructive/25'
                    : 'bg-muted/60 text-muted-foreground border border-border'
                }`}>{log.statusCode}</span>
              </td>
              <td className="px-3 py-2.5 max-w-0">
                <span className="block truncate font-mono text-[11px] text-muted-foreground" title={log.endpoint}>
                  {log.endpoint}
                </span>
              </td>
              <td className="px-3 py-2.5 max-w-0">
                <span className="block truncate text-[12px] text-foreground" title={log.message}>
                  {log.message}
                </span>
              </td>
              <td className="px-3 py-2.5 max-w-0">
                {log.userId ? (
                  <span className="block truncate font-mono text-[11px] text-muted-foreground" title={log.userId}>
                    {log.userId}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-2 py-2.5 text-center">
                <CopyButton data={log} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const iconBtnCls = 'w-8 h-8 rounded-lg border-[1.5px] border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground cursor-pointer flex items-center justify-center transition-colors disabled:opacity-35';

export function MonitoringErrorsTab() {
  const { t } = useTranslation();
  const { errors, meta, page, isLoading, fetchPage } = useMonitoringErrors();

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  return (
    <div className="flex flex-col gap-3">
      {/* Info banner */}
      <div className="flex items-start gap-2 rounded-2xl border border-blue-500/25 bg-blue-500/10 px-3.5 py-2.75 text-[12.5px] text-blue-600 dark:text-blue-400 leading-[1.45]">
        <Info size={15} className="shrink-0 mt-0.5" />
        <span>{t('monitoring.errors.cleanup')}</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-display text-[15px] font-semibold tracking-[0.01em] text-foreground">
            {t('monitoring.errors.title')}
          </h3>
        </div>

        {isLoading ? (
          <div className="p-4 flex flex-col gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : errors.length === 0 ? (
          <p className="px-4 py-3.5 text-[13px] text-muted-foreground">{t('monitoring.errors.noErrors')}</p>
        ) : (
          <>
            <ErrorsTable rows={errors} />

            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/20">
                <span className="text-[12px] text-muted-foreground">
                  {page} / {meta.totalPages}
                </span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => fetchPage(page - 1)}
                    disabled={page <= 1 || isLoading}
                    className={iconBtnCls}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => fetchPage(page + 1)}
                    disabled={page >= meta.totalPages || isLoading}
                    className={iconBtnCls}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
