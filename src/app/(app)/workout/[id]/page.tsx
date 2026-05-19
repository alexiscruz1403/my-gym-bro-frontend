'use client';

import { use } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { PlanDetailView } from '@/components/workout/PlanDetailView';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { usePlan } from '@/hooks/usePlan';

interface PlanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PlanDetailPage({ params }: PlanDetailPageProps) {
  const { id } = use(params);
  const { t } = useTranslation();
  const { data, loading, error, refetch } = usePlan(id);

  return (
    <>
      <PageHeader
        title={data?.name ?? (loading ? '' : t('plans.title'))}
        backHref="/workout"
      />

      <PageContainer>
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-xl" />
              <Skeleton className="h-9 w-20 rounded-xl" />
              <Skeleton className="h-9 w-20 rounded-xl" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-2xl" />
            ))}
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        {!loading && !error && data && (
          <PlanDetailView plan={data} onUpdate={refetch} />
        )}
      </PageContainer>
    </>
  );
}
