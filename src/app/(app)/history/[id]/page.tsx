'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { SessionDetailHeader } from '@/components/history/SessionDetailHeader';
import { SessionDetailExerciseList } from '@/components/history/SessionDetailExerciseList';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { useSessionDetail } from '@/hooks/useSessionDetail';
import { ExportSessionButton } from '@/components/history/ExportSessionButton';

function SessionDetailSkeletons() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-24 w-full rounded-2xl" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-2xl" />
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
  const { t } = useTranslation();
  const { session, loading, error, refetch } = useSessionDetail(id);

  return (
    <>
      <PageHeader title={t('history.sessionDetailTitle')} onBack={() => router.back()} />
      <PageContainer>
        <div className="space-y-4">
          {loading && <SessionDetailSkeletons />}

          {!loading && error && (
            <EmptyState
              title={t('history.sessionErrorTitle')}
              description={t('history.sessionErrorDescription')}
              action={
                <button
                  type="button"
                  onClick={refetch}
                  className="flex h-11 cursor-pointer items-center rounded-xl border border-border bg-card px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {t('common.retry')}
                </button>
              }
            />
          )}

          {!loading && !error && session && (
            <>
              <SessionDetailHeader session={session} />
              <ExportSessionButton sessionId={session._id} sessionStatus={session.status} />
              <SessionDetailExerciseList exercises={session.exercises} />
            </>
          )}
        </div>
      </PageContainer>
    </>
  );
}
