'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { HistoryTabSwitcher } from '@/components/shared/HistoryTabSwitcher';
import { SessionHistoryList } from '@/components/history/SessionHistoryList';
import { StatsPanel } from '@/components/stats/StatsPanel';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSessionHistory } from '@/hooks/useSessionHistory';
import { useStats } from '@/hooks/useStats';
import type { HistoryTab } from '@/components/shared/HistoryTabSwitcher';

function SessionHistorySkeletons() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<HistoryTab>('history');
  const { data, meta, loading, error, page, setPage, refetch } = useSessionHistory();
  const {
    period, date, setPeriod, setDate,
    volumeData, muscleData,
    loading: statsLoading, error: statsError,
  } = useStats();

  return (
    <PageContainer>
      <div className="space-y-4">
        <HistoryTabSwitcher activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'history' && (
          <>
            {loading && <SessionHistorySkeletons />}

            {!loading && error && (
              <EmptyState
                title="Error al cargar el historial"
                description="No se pudieron obtener las sesiones. Intenta de nuevo."
                action={
                  <Button variant="outline" size="sm" className="min-h-11" onClick={refetch}>
                    Reintentar
                  </Button>
                }
              />
            )}

            {!loading && !error && data.length === 0 && (
              <EmptyState
                title="Sin entrenamientos registrados"
                description="Aún no has completado ninguna sesión."
                action={
                  <Button size="sm" className="min-h-11" render={<Link href="/dashboard" />}>
                    Ir al inicio
                  </Button>
                }
              />
            )}

            {!loading && !error && data.length > 0 && meta && (
              <SessionHistoryList
                data={data}
                meta={meta}
                page={page}
                onPageChange={setPage}
              />
            )}
          </>
        )}

        {activeTab === 'stats' && (
          <StatsPanel
            period={period}
            date={date}
            volumeData={volumeData}
            muscleData={muscleData}
            loading={statsLoading}
            error={statsError}
            onPeriodChange={setPeriod}
            onDateChange={setDate}
            onRetry={() => { setPeriod(period); }}
          />
        )}
      </div>
    </PageContainer>
  );
}
