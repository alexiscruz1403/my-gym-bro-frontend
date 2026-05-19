'use client';

import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExerciseConfigRow } from './ExerciseConfigRow';
import { ChevronDown, Link } from 'lucide-react';
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
  planId?: string;
  showSwap?: boolean;
}

export function PlanDayAccordion({ days, planId, showSwap }: PlanDayAccordionProps) {
  const { t } = useTranslation();

  return (
    <Accordion multiple className="flex w-full flex-col gap-2">
      {days.map((day) => {
        const groups = groupExercises(day.exercises);

        return (
          <AccordionItem
            key={day.dayOfWeek}
            value={day.dayOfWeek}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-1"
          >
            <AccordionTrigger className="cursor-pointer gap-2.5 px-4 py-3.5 hover:bg-muted/30 hover:no-underline">
              <span className="font-display rounded-lg bg-primary/10 px-2 py-0.5 text-[12px] font-bold tracking-[0.04em] text-primary">
                {t(`daysShort.${day.dayOfWeek}`)}
              </span>
              <span className="flex-1 text-left text-[14px] font-semibold text-foreground">
                {day.dayName ?? t(`days.${day.dayOfWeek}`)}
              </span>
              <span className="text-[12px] text-muted-foreground">
                {t('plans.exerciseCount', { count: day.exercises.length })}
              </span>
            </AccordionTrigger>
            <AccordionContent className="border-t border-border px-3 pb-2 pt-1">
              <div>
                {groups.map((group, gi) =>
                  group.type === 'standalone' ? (
                    <ExerciseConfigRow
                      key={gi}
                      config={group.exercise}
                      planId={planId}
                      showSwap={showSwap}
                      showBorder={gi < groups.length - 1}
                    />
                  ) : (
                    <div
                      key={gi}
                      className="my-1 border-l-[3px] border-primary pl-2"
                    >
                      <div className="flex items-center gap-1 px-1 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-primary">
                        <Link className="h-3 w-3" />
                        Superserie {group.groupId}
                      </div>
                      {group.exercises.map((ex, ei) => (
                        <ExerciseConfigRow
                          key={`${ex.exerciseId}-${ei}`}
                          config={ex}
                          planId={planId}
                          showSwap={showSwap}
                          showBorder={ei < group.exercises.length - 1}
                        />
                      ))}
                    </div>
                  ),
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
