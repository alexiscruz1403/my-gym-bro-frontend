'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseSessionCard } from './ExerciseSessionCard';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { SessionExercise } from '@/types/domain.types';
import type { LogSetRequest, ModifyExerciseRequest, ReplaceExerciseRequest } from '@/types/api.types';

interface ExerciseNavigatorProps {
  exercises: SessionExercise[];
  onLogSet: (dto: LogSetRequest) => Promise<void>;
  onModify: (exerciseId: string, dto: ModifyExerciseRequest) => Promise<void>;
  onReplace: (exerciseId: string, dto: ReplaceExerciseRequest) => Promise<void>;
}

export function ExerciseNavigator({ exercises, onLogSet, onModify, onReplace }: ExerciseNavigatorProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const current = exercises[activeIndex];

  if (!current) return null;

  return (
    <div className="flex flex-1 flex-col">
      {/* Progress dots */}
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-full items-center justify-center gap-1 px-4 py-3">
          {exercises.map((ex, i) => {
            const done = ex.sets.filter((s) => s.completed).length === ex.plannedSets;
            return (
              <button
                key={ex.exerciseId}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="flex cursor-pointer items-center justify-center px-1 py-3"
                aria-label={`Go to ${ex.exerciseName}`}
              >
                <span
                  className={cn(
                    'block h-2 rounded-full transition-all',
                    i === activeIndex
                      ? 'bg-primary w-6'
                      : done
                        ? 'bg-accent w-2'
                        : 'bg-muted w-2',
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Card — padding-bottom reserves space for the fixed nav bar */}
      <div className="flex-1 overflow-y-auto pb-29 lg:pb-13">
        <ExerciseSessionCard
          exercise={current}
          onLogSet={onLogSet}
          onModify={onModify}
          onReplace={onReplace}
          onExerciseCompleted={
            activeIndex < exercises.length - 1
              ? () => setActiveIndex((i) => i + 1)
              : undefined
          }
        />
      </div>

      {/* Prev / Next navigation — fixed at bottom of viewport */}
      <div
        className="fixed bottom-16 left-0 right-0 z-20 flex h-13 items-center justify-between border-t px-4 lg:bottom-0 lg:left-60"
        style={{ background: 'var(--sheet-bg)' }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          disabled={activeIndex === 0}
          className="cursor-pointer gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('session.prev')}
        </Button>

        <span className="font-display text-sm font-bold tabular-nums text-muted-foreground">
          {activeIndex + 1} / {exercises.length}
        </span>

        {activeIndex < exercises.length - 1 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveIndex((i) => i + 1)}
            className="cursor-pointer gap-1"
          >
            {t('session.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-1 text-sm text-accent font-medium">
            <Check className="h-4 w-4" />
            {t('session.last')}
          </div>
        )}
      </div>
    </div>
  );
}
