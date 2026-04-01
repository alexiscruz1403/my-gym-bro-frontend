'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { SessionDetailHeader } from '@/components/history/SessionDetailHeader';
import { SessionDetailExerciseList } from '@/components/history/SessionDetailExerciseList';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft } from 'lucide-react';
import { useSessionDetail } from '@/hooks/useSessionDetail';

function SessionDetailSkeletons() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-20 w-full rounded-xl" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-36 w-full rounded-xl" />
      ))}
    </div>
  );
}

interface SessionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { session, loading, error, refetch } = useSessionDetail(id);

  return (
    <PageContainer>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground flex min-h-11 items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </button>

        {loading && <SessionDetailSkeletons />}

        {!loading && error && (
          <EmptyState
            title="Error al cargar la sesión"
            description="No se pudo obtener el detalle. Intenta de nuevo."
            action={
              <Button variant="outline" size="sm" className="min-h-11" onClick={refetch}>
                Reintentar
              </Button>
            }
          />
        )}

        {!loading && !error && session && (
          <>
            <SessionDetailHeader session={session} />
            <SessionDetailExerciseList exercises={session.exercises} />
          </>
        )}
      </div>
    </PageContainer>
  );
}
