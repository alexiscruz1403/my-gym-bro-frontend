'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { ExerciseDetail } from '@/components/exercises/ExerciseDetail';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { Button } from '@/components/ui/button';
import { useExercise } from '@/hooks/useExercise';
import { ArrowLeft } from 'lucide-react';

interface ExerciseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = useExercise(id);

  return (
    <PageContainer>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="mb-2 -ml-2"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && data && <ExerciseDetail exercise={data} />}
    </PageContainer>
  );
}
