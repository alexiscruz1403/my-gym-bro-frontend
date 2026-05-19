'use client';

import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ExerciseCatalog } from '@/components/exercises/ExerciseCatalog';
import { Skeleton } from '@/components/ui/skeleton';

function ExerciseListSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-8 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default function ExercisesPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={t('exercises.title')} backHref="/workout" />

      <PageContainer>
        <Suspense fallback={<ExerciseListSkeleton />}>
          <ExerciseCatalog mode="browse" />
        </Suspense>
      </PageContainer>
    </>
  );
}
