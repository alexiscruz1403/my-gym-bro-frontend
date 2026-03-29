import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Dumbbell, ChevronRight } from 'lucide-react';
import type { WorkoutPlan } from '@/types/domain.types';

const DAY_SHORT: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
};

interface ActivePlanCardProps {
  plan: WorkoutPlan;
}

export function ActivePlanCard({ plan }: ActivePlanCardProps) {
  const totalExercises = plan.days.reduce(
    (acc, day) => acc + day.exercises.length,
    0,
  );

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
            <Badge key={day.dayOfWeek} variant="secondary">
              {DAY_SHORT[day.dayOfWeek]}
            </Badge>
          ))}
        </div>

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
