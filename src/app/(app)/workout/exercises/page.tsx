'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { ExerciseCatalog } from '@/components/exercises/ExerciseCatalog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

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
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <PageContainer>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push('/workout')}
        className="mb-2 -ml-2 min-h-11 min-w-11 cursor-pointer"
        aria-label="Back to plans"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="font-display mb-4 text-2xl font-bold">{t('exercises.title')}</h1>
      <Suspense fallback={<ExerciseListSkeleton />}>
        <ExerciseCatalog mode="browse" />
      </Suspense>
    </PageContainer>
  );
}
