'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getDay } from 'date-fns';
import { toast } from 'sonner';
import { PlanCard } from './PlanCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { StartSessionSheet } from '@/components/session/StartSessionSheet';
import { getPlan } from '@/services/workout-plans.service';
import { startSession } from '@/services/sessions.service';
import useSessionStore from '@/store/session.store';
import type { PlanListItem, WorkoutPlan, DayOfWeek } from '@/types/domain.types';

const DAY_INDEX_MAP: DayOfWeek[] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
];

interface PlanListProps {
  plans: PlanListItem[];
}

export function PlanList({ plans }: PlanListProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { startSession: storeStartSession } = useSessionStore();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const todayDow = DAY_INDEX_MAP[getDay(new Date())];

  const handleOpenSheet = async (planId: string) => {
    setLoadingPlanId(planId);
    try {
      const plan = await getPlan(planId);
      setSelectedPlan(plan);
      setSheetOpen(true);
    } catch {
      toast.error(t('session.error.startFailed'));
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleStart = async (dayOfWeek: DayOfWeek) => {
    if (!selectedPlan) return;
    try {
      const session = await startSession({ dayOfWeek, planId: selectedPlan.id });
      storeStartSession(session._id);
      setSheetOpen(false);
      router.push('/session');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 422) {
        toast.error(t('session.error.noExercisesForDay'));
      } else {
        toast.error(t('session.error.startFailed'));
      }
    }
  };

  if (plans.length === 0) {
    return (
      <EmptyState
        title={t('plans.empty.title')}
        description={t('plans.empty.description')}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onStart={handleOpenSheet}
            startLoading={loadingPlanId === plan.id}
          />
        ))}
      </div>

      {selectedPlan && (
        <StartSessionSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          plan={selectedPlan}
          todayDow={todayDow}
          onStart={handleStart}
        />
      )}
    </>
  );
}
