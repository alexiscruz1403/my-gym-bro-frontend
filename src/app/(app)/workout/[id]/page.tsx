'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlanDetailView } from '@/components/workout/PlanDetailView';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { usePlan } from '@/hooks/usePlan';
import { ArrowLeft } from 'lucide-react';

interface PlanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PlanDetailPage({ params }: PlanDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error, refetch } = usePlan(id);

  return (
    <PageContainer>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push('/workout')}
        className="mb-2 -ml-2 cursor-pointer"
        aria-label="Back to plans"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      )}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && data && (
        <PlanDetailView plan={data} onUpdate={refetch} />
      )}
    </PageContainer>
  );
}
