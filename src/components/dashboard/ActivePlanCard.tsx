'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDay } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Dumbbell, ChevronRight, Play } from 'lucide-react';
import { toast } from 'sonner';
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
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold">{plan.name}</p>
                <Badge className="shrink-0 bg-green-500 text-white hover:bg-green-600">
                  {t('plans.status.active')}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="text-muted-foreground h-4 w-4" />
              <span>{t('plans.dayCount', { count: plan.days.length })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Dumbbell className="text-muted-foreground h-4 w-4" />
              <span>{t('plans.exerciseCount', { count: totalExercises })}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {plan.days.map((day) => (
              <Badge
                key={day.dayOfWeek}
                variant={day.dayOfWeek === todayDow ? 'default' : 'secondary'}
              >
                {dayShortLabels[day.dayOfWeek]}
              </Badge>
            ))}
          </div>

          <Button
            size="default"
            onClick={() => setSheetOpen(true)}
            className="w-full cursor-pointer gap-2"
          >
            <Play className="h-4 w-4" />
            {t('session.startWorkout')}
          </Button>

          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/workout/${plan.id}`} />}
            className="w-full gap-1"
          >
            {t('plans.viewFull')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

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
