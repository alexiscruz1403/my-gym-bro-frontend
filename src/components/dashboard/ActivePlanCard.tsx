'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Dumbbell, ChevronRight, Play } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { startSession } from '@/services/sessions.service';
import useSessionStore from '@/store/session.store';
import { StartSessionSheet } from '@/components/session/StartSessionSheet';
import type { WorkoutPlan, DayOfWeek } from '@/types/domain.types';

const DAY_INDEX_MAP: DayOfWeek[] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
];

function getTodayDayOfWeek(): DayOfWeek {
  return DAY_INDEX_MAP[getDay(new Date())];
}

interface ActivePlanCardProps {
  plan: WorkoutPlan;
}

export function ActivePlanCard({ plan }: ActivePlanCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { startSession: storeStartSession } = useSessionStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  const dayShortLabels = t('daysShort', { returnObjects: true }) as Record<DayOfWeek, string>;
  const totalExercises = plan.days.reduce((acc, day) => acc + day.exercises.length, 0);
  const todayDow = getTodayDayOfWeek();

  const handleStart = async (dayOfWeek: DayOfWeek) => {
    try {
      const session = await startSession({ dayOfWeek });
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
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-1">
        {/* Plan name + status pills */}
        <div className="px-[18px] pb-[14px] pt-4">
          <div className="font-display text-[19px] font-bold leading-tight tracking-[0.01em]">
            {plan.name}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-accent">
              ● {t('plans.status.active')}
            </span>
            {plan.isAiGenerated && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">
                ✦ IA
              </span>
            )}
          </div>
        </div>

        {/* Day pills */}
        <div className="flex flex-wrap gap-1.5 px-[18px] pb-3.5">
          {plan.days.map((day) => (
            <span
              key={day.dayOfWeek}
              className={cn(
                'rounded-full border px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors',
                day.dayOfWeek === todayDow
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-muted text-muted-foreground',
              )}
              style={
                day.dayOfWeek === todayDow
                  ? { boxShadow: '0 2px 8px oklch(62% .20 35 / .30)' }
                  : undefined
              }
            >
              {dayShortLabels[day.dayOfWeek]}
            </span>
          ))}
        </div>

        {/* Meta row */}
        <div className="flex gap-4 px-[18px] pb-4">
          <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {t('plans.dayCount', { count: plan.days.length })}
          </span>
          <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <Dumbbell className="h-3.5 w-3.5" />
            {t('plans.exerciseCount', { count: totalExercises })}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Actions */}
        <div className="flex flex-col gap-2 px-[18px] pb-4 pt-[14px]">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Play className="h-4 w-4 fill-current" />
            {t('session.startWorkout')}
          </button>
          <Link
            href={`/workout/${plan.id}`}
            className="flex items-center justify-center gap-1 py-0.5 text-[13px] text-muted-foreground transition-colors hover:text-primary"
          >
            {t('plans.viewFull')}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <StartSessionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        plan={plan}
        todayDow={todayDow}
        onStart={handleStart}
      />
    </>
  );
}
