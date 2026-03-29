'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { CreatePlanWizard } from '@/components/workout/wizard/CreatePlanWizard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import usePlanBuilderStore from '@/store/plan-builder.store';

export default function NewPlanPage() {
  const router = useRouter();
  const { mode, reset } = usePlanBuilderStore();

  useEffect(() => {
    if (mode === 'edit') reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <CreatePlanWizard />
    </PageContainer>
  );
}
