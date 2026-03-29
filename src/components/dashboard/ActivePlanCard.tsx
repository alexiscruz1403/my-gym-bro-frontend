'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDay } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Dumbbell, ChevronRight, Play } from 'lucide-react';
import { toast } from 'sonner';
import { startSession } from '@/services/sessions.service';
import useSessionStore from '@/store/session.store';
import type { WorkoutPlan, DayOfWeek } from '@/types/domain.types';

const DAY_SHORT: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

// date-fns getDay: 0=Sun, 1=Mon, ..., 6=Sat
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
  const router = useRouter();
  const { startSession: storeStartSession } = useSessionStore();
  const [starting, setStarting] = useState(false);

  const totalExercises = plan.days.reduce(
    (acc, day) => acc + day.exercises.length,
    0,
  );

  const todayDow = getTodayDayOfWeek();
  const todayPlanDay = plan.days.find((d) => d.dayOfWeek === todayDow);
  const hasWorkoutToday = (todayPlanDay?.exercises.length ?? 0) > 0;

  const handleStart = async () => {
    // FT-30: no exercises today — show toast, do not call API
    if (!hasWorkoutToday) {
      toast.info(`No exercises scheduled for today (${DAY_SHORT[todayDow]})`);
      return;
    }

    setStarting(true);
    try {
      const session = await startSession({ dayOfWeek: todayDow });
      storeStartSession(session._id);
      router.push('/session');
    } catch {
      toast.error('Could not start workout. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-semibold">{plan.name}</p>
              <Badge className="shrink-0 bg-green-500 text-white hover:bg-green-600">
                Active
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="text-muted-foreground h-4 w-4" />
            <span>
              {plan.days.length} {plan.days.length === 1 ? 'day' : 'days'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Dumbbell className="text-muted-foreground h-4 w-4" />
            <span>
              {totalExercises} {totalExercises === 1 ? 'exercise' : 'exercises'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {plan.days.map((day) => (
            <Badge
              key={day.dayOfWeek}
              variant={day.dayOfWeek === todayDow ? 'default' : 'secondary'}
            >
              {DAY_SHORT[day.dayOfWeek]}
            </Badge>
          ))}
        </div>

        {/* Start workout CTA */}
        <Button
          size="default"
          onClick={handleStart}
          disabled={starting}
          className="w-full cursor-pointer gap-2"
        >
          <Play className="h-4 w-4" />
          {starting ? 'Starting…' : hasWorkoutToday ? 'Start workout' : `No workout today (${DAY_SHORT[todayDow]})`}
        </Button>

        <Button
          variant="outline"
          size="sm"
          render={<Link href={`/workout/${plan.id}`} />}
          className="w-full gap-1"
        >
          View full plan
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
