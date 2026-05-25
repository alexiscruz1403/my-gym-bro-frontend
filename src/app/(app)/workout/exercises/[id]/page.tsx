'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ExerciseDetail } from '@/components/exercises/ExerciseDetail';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { useExercise } from '@/hooks/useExercise';

interface ExerciseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useExercise(id);

  return (
    <>
      <PageHeader title={data?.name ?? ''} onBack={() => router.back()} />
      <PageContainer>
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && data && <ExerciseDetail exercise={data} />}
      </PageContainer>
    </>
  );
}
