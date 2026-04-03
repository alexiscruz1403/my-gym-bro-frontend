'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseSessionCard } from './ExerciseSessionCard';
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
                    'block h-3 rounded-full transition-all',
                    i === activeIndex
                      ? 'bg-primary w-6'
                      : done
                        ? 'bg-green-500 w-2.5'
                        : 'bg-muted w-2.5',
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 overflow-y-auto">
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

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between border-t px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
          disabled={activeIndex === 0}
          className="cursor-pointer gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>

        <span className="text-muted-foreground text-sm tabular-nums">
          {activeIndex + 1} / {exercises.length}
        </span>

        {activeIndex < exercises.length - 1 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveIndex((i) => i + 1)}
            className="cursor-pointer gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
            <Check className="h-4 w-4" />
            Last
          </div>
        )}
      </div>
    </div>
  );
}
