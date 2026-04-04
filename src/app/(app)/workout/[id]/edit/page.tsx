'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import dynamic from 'next/dynamic';

const CreatePlanWizard = dynamic(
  () => import('@/components/workout/wizard/CreatePlanWizard').then((m) => m.CreatePlanWizard),
  { ssr: false, loading: () => <div className="flex justify-center py-12"><LoadingSpinner /></div> },
);
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import usePlanBuilderStore from '@/store/plan-builder.store';
import { usePlan } from '@/hooks/usePlan';

interface EditPlanPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPlanPage({ params }: EditPlanPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error } = usePlan(id);
  const { loadPlan, editingPlanId } = usePlanBuilderStore();

  useEffect(() => {
    if (data && editingPlanId !== data.id) {
      loadPlan(data);
    }
  }, [data, editingPlanId, loadPlan]);

  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage message={error} />
      </PageContainer>
    );
  }

  if (!data || editingPlanId !== id) {
    return (
      <PageContainer>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push(`/workout/${id}`)}
        className="mb-2 -ml-2 min-h-11 min-w-11 cursor-pointer"
        aria-label="Back to plan"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <CreatePlanWizard />
    </PageContainer>
  );
}
