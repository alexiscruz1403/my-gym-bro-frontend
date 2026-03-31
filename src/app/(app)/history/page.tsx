'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { HistoryTabSwitcher } from '@/components/shared/HistoryTabSwitcher';
import { SessionHistoryList } from '@/components/history/SessionHistoryList';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSessionHistory } from '@/hooks/useSessionHistory';
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
                  <Button variant="outline" size="sm" onClick={refetch}>
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
                  <Button size="sm" render={<Link href="/dashboard" />}>
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
          <div className="py-8 text-center text-sm text-muted-foreground">
            Estadísticas disponibles en Phase 4.
          </div>
        )}
      </div>
    </PageContainer>
  );
}
