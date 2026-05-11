'use client';

import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExerciseConfigRow } from './ExerciseConfigRow';
import { Separator } from '@/components/ui/separator';
import { Link } from 'lucide-react';
import type { PlanDay, ExerciseConfig } from '@/types/domain.types';

// Group consecutive exercises that share the same supersetGroupId.
type StandaloneItem = { type: 'standalone'; exercise: ExerciseConfig };
type SupersetItem = { type: 'superset'; groupId: string; exercises: ExerciseConfig[] };
type ExerciseGroupItem = StandaloneItem | SupersetItem;

function groupExercises(exercises: ExerciseConfig[]): ExerciseGroupItem[] {
  const result: ExerciseGroupItem[] = [];

  for (const ex of exercises) {
    if (!ex.supersetGroupId) {
      result.push({ type: 'standalone', exercise: ex });
      continue;
    }

    const last = result[result.length - 1];
    if (last?.type === 'superset' && last.groupId === ex.supersetGroupId) {
      last.exercises.push(ex);
    } else {
      result.push({ type: 'superset', groupId: ex.supersetGroupId, exercises: [ex] });
    }
  }

  return result;
}

interface PlanDayAccordionProps {
  days: PlanDay[];
}

export function PlanDayAccordion({ days }: PlanDayAccordionProps) {
  const { t } = useTranslation();

  return (
    <Accordion multiple className="w-full">
      {days.map((day) => {
        const groups = groupExercises(day.exercises);

        return (
          <AccordionItem key={day.dayOfWeek} value={day.dayOfWeek}>
            <AccordionTrigger className="cursor-pointer text-sm font-medium">
              {t(`days.${day.dayOfWeek}`)}
              {day.dayName && (
                <span className="text-muted-foreground font-normal"> · {day.dayName}</span>
              )}
              <span className="text-muted-foreground ml-auto mr-2 text-xs">
                {t('plans.exerciseCount', { count: day.exercises.length })}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {groups.map((group, gi) => (
                  <div key={gi}>
                    {group.type === 'standalone' ? (
                      <ExerciseConfigRow config={group.exercise} />
                    ) : (
                      <div className="border-primary/40 rounded-lg border-l-2 pl-2">
                        <div className="text-primary mb-1 flex items-center gap-1 px-1 pt-1 text-xs font-medium">
                          <Link className="h-3 w-3" />
                          Superset {group.groupId}
                        </div>
                        {group.exercises.map((ex, ei) => (
                          <div key={`${ex.exerciseId}-${ei}`}>
                            <ExerciseConfigRow config={ex} />
                            {ei < group.exercises.length - 1 && (
                              <Separator className="ml-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {gi < groups.length - 1 && <Separator />}
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
