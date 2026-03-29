import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExerciseConfigRow } from './ExerciseConfigRow';
import { Separator } from '@/components/ui/separator';
import type { PlanDay } from '@/types/domain.types';

const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

interface PlanDayAccordionProps {
  days: PlanDay[];
}

export function PlanDayAccordion({ days }: PlanDayAccordionProps) {
  return (
    <Accordion multiple className="w-full">
      {days.map((day) => {
        // Build a set of exercise indices that are the first in their superset group
        const supersetFirstIndices = new Set<number>();
        const seenGroups = new Set<string>();
        day.exercises.forEach((ex, i) => {
          if (ex.supersetGroupId && !seenGroups.has(ex.supersetGroupId)) {
            seenGroups.add(ex.supersetGroupId);
            // Mark the second occurrence (index after first group member) as start
          } else if (ex.supersetGroupId && seenGroups.has(ex.supersetGroupId)) {
            supersetFirstIndices.add(i);
          }
        });

        return (
          <AccordionItem key={day.dayOfWeek} value={day.dayOfWeek}>
            <AccordionTrigger className="text-sm font-medium">
              {DAY_LABELS[day.dayOfWeek]}
              <span className="text-muted-foreground ml-auto mr-2 text-xs">
                {day.exercises.length} {day.exercises.length === 1 ? 'exercise' : 'exercises'}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {day.exercises.map((ex, i) => (
                  <div key={`${ex.exerciseId}-${i}`}>
                    <ExerciseConfigRow
                      config={ex}
                      isFirstInSuperset={supersetFirstIndices.has(i)}
                    />
                    {i < day.exercises.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
