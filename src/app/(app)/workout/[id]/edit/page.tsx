'use client';

import { use, useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { CreatePlanWizard } from '@/components/workout/wizard/CreatePlanWizard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import usePlanBuilderStore from '@/store/plan-builder.store';
import { usePlan } from '@/hooks/usePlan';

interface EditPlanPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPlanPage({ params }: EditPlanPageProps) {
  const { id } = use(params);
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
        <p className="text-destructive py-8 text-center text-sm">{error}</p>
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
      <CreatePlanWizard />
    </PageContainer>
  );
}
