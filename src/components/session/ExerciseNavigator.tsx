'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseSessionCard } from './ExerciseSessionCard';
import { cn } from '@/lib/utils';
import type { SessionExercise } from '@/types/domain.types';
import type { LogSetRequest, ModifyExerciseRequest } from '@/types/api.types';

interface ExerciseNavigatorProps {
  exercises: SessionExercise[];
  onLogSet: (dto: LogSetRequest) => Promise<void>;
  onModify: (exerciseId: string, dto: ModifyExerciseRequest) => Promise<void>;
}

export function ExerciseNavigator({ exercises, onLogSet, onModify }: ExerciseNavigatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = exercises[activeIndex];

  if (!current) return null;

  return (
    <div className="flex flex-1 flex-col">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 px-4 py-3">
        {exercises.map((ex, i) => {
          const done = ex.sets.filter((s) => s.completed).length === ex.plannedSets;
          return (
            <button
              key={ex.exerciseId}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                'flex h-2.5 w-2.5 cursor-pointer items-center justify-center rounded-full transition-all',
                i === activeIndex
                  ? 'bg-primary w-6'
                  : done
                    ? 'bg-green-500'
                    : 'bg-muted',
              )}
              aria-label={`Go to ${ex.exerciseName}`}
            />
          );
        })}
      </div>

      {/* Card */}
      <div className="flex-1 overflow-y-auto">
        <ExerciseSessionCard
          exercise={current}
          onLogSet={onLogSet}
          onModify={onModify}
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
