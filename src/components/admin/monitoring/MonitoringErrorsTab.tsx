'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

function ErrorsTable({ rows }: { rows: ErrorLog[] }) {
  const { t } = useTranslation();

  return (
    <table className="w-full table-fixed text-sm">
      <thead>
        <tr className="border-b bg-muted/40">
          <th className="w-[15%] px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{t('common.date')}</th>
          <th className="w-[7%] px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{t('monitoring.errors.code')}</th>
          <th className="w-[25%] px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{t('monitoring.errors.endpoint')}</th>
          <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{t('monitoring.errors.message')}</th>
          <th className="w-[13%] px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{t('monitoring.errors.user')}</th>
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
              <Badge variant={log.statusCode >= 500 ? 'destructive' : 'outline'}>
                {log.statusCode}
              </Badge>
            </td>
            <td className="max-w-0 px-3 py-3">
              <span className="block truncate font-mono text-xs text-muted-foreground" title={log.endpoint}>
                {log.endpoint}
              </span>
            </td>
            <td className="max-w-0 px-3 py-3">
              <span className="block truncate text-xs" title={log.message}>
                {log.message}
              </span>
            </td>
            <td className="max-w-0 px-3 py-3">
              {log.userId ? (
                <span className="block truncate font-mono text-xs text-muted-foreground" title={log.userId}>
                  {log.userId}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
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

export function MonitoringErrorsTab() {
  const { t } = useTranslation();
  const { errors, meta, page, isLoading, fetchPage } = useMonitoringErrors();

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30 px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
        <Info size={16} className="shrink-0 mt-0.5" />
        <span>{t('monitoring.errors.cleanup')}</span>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold">{t('monitoring.errors.title')}</h3>
        </div>

        {isLoading ? (
          <div className="p-5 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded" />
            ))}
          </div>
        ) : errors.length === 0 ? (
          <p className="px-5 py-4 text-sm text-muted-foreground">{t('monitoring.errors.noErrors')}</p>
        ) : (
          <>
            <ErrorsTable rows={errors} />

            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t bg-muted/20">
                <span className="text-xs text-muted-foreground">
                  {page} / {meta.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchPage(page - 1)}
                    disabled={page <= 1 || isLoading}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchPage(page + 1)}
                    disabled={page >= meta.totalPages || isLoading}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
