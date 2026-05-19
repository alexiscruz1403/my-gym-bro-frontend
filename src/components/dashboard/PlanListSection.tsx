'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getDay } from 'date-fns';
import { CalendarDays, Dumbbell, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPlan } from '@/services/workout-plans.service';
import { startSession } from '@/services/sessions.service';
import useSessionStore from '@/store/session.store';
import { StartSessionSheet } from '@/components/session/StartSessionSheet';
import type { PlanListItem, WorkoutPlan, DayOfWeek } from '@/types/domain.types';

const DAY_INDEX_MAP: DayOfWeek[] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
];

function getTodayDayOfWeek(): DayOfWeek {
  return DAY_INDEX_MAP[getDay(new Date())];
}

interface PlanListSectionProps {
  title: string;
  plans: PlanListItem[];
}

export function PlanListSection({ title, plans }: PlanListSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { startSession: storeStartSession } = useSessionStore();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const todayDow = getTodayDayOfWeek();

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

  return (
    <>
      {/* Section header */}
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
          {title}
        </span>
        <span className="rounded-full border border-border bg-muted px-2 py-px text-[12px] font-medium text-muted-foreground">
          {plans.length}
        </span>
      </div>

      {/* Plan rows */}
      <div className="flex flex-col gap-1.5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 shadow-1 transition-colors hover:bg-muted/50"
          >
            {/* Dumbbell icon */}
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
              <Dumbbell className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold">{plan.name}</p>
              <div className="mt-0.5 flex items-center gap-1 text-[12px] text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                <span>{t('plans.dayCount', { count: plan.daysCount })}</span>
              </div>
            </div>

            {/* Active pill */}
            {plan.isActive && (
              <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-accent">
                {t('plans.status.active')}
              </span>
            )}

            {/* Play button */}
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[10px] bg-primary text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
              disabled={loadingPlanId === plan.id}
              onClick={() => handleOpenSheet(plan.id)}
              aria-label={`${t('session.startWorkout')} — ${plan.name}`}
            >
              {loadingPlanId === plan.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-current" />
              )}
            </button>
          </div>
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
