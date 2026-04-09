'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const CreatePlanWizard = dynamic(
  () => import('@/components/workout/wizard/CreatePlanWizard').then((m) => m.CreatePlanWizard),
  { ssr: false, loading: () => <div className="flex justify-center py-12"><LoadingSpinner /></div> },
);
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

  const handleBack = () => {
    reset();
    router.push('/workout');
  }

  return (
    <PageContainer>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBack}
        className="mb-2 -ml-2 min-h-11 min-w-11 cursor-pointer"
        aria-label="Back to plans"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <CreatePlanWizard />
    </PageContainer>
  );
}
