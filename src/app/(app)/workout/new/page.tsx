'use client';

import { useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { CreatePlanWizard } from '@/components/workout/wizard/CreatePlanWizard';
import usePlanBuilderStore from '@/store/plan-builder.store';

export default function NewPlanPage() {
  const { mode, reset } = usePlanBuilderStore();

  // If arriving fresh (not resuming an edit), reset to create mode
  useEffect(() => {
    if (mode === 'edit') reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <CreatePlanWizard />
    </PageContainer>
  );
}
