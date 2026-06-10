'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, ImageOff, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExerciseSessionCard } from './ExerciseSessionCard';
import { AddExerciseSheet } from './AddExerciseSheet';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { SessionExercise, Exercise } from '@/types/domain.types';
import type { LogSetRequest, ModifyExerciseRequest, ReplaceExerciseRequest } from '@/types/api.types';

interface ExerciseNavigatorProps {
  exercises: SessionExercise[];
  activeIndex: number;
  onIndexChange: (i: number) => void;
  onLogSet: (dto: LogSetRequest) => Promise<void>;
  onModify: (exerciseId: string, dto: ModifyExerciseRequest) => Promise<void>;
  onReplace: (exerciseId: string, dto: ReplaceExerciseRequest) => Promise<void>;
  onAdd: (exerciseIds: string[]) => Promise<void>;
}

export function ExerciseNavigator({ exercises, activeIndex, onIndexChange, onLogSet, onModify, onReplace, onAdd }: ExerciseNavigatorProps) {
  const { t } = useTranslation();
  const [addOpen, setAddOpen] = useState(false);
  const current = exercises[activeIndex];

  if (!current) return null;

  const handleAddConfirm = async (selected: Exercise[]) => {
    const firstNewIndex = exercises.length;
    await onAdd(selected.map((e) => e.id));
    onIndexChange(firstNewIndex);
    setAddOpen(false);
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Exercise thumbnails */}
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-full items-center gap-2 px-4 py-3">
          {exercises.map((ex, i) => {
            const isCompleted = ex.sets.length > 0 && ex.sets.filter((s) => s.completed).length === ex.plannedSets;
            const isActive = i === activeIndex;
            return (
              <button
                key={ex.exerciseId}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Go to ${ex.exerciseName}`}
                className={cn(
                  'h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all',
                  isActive
                    ? 'border-primary ring-2 ring-primary/30'
                    : isCompleted
                      ? 'border-green-500'
                      : 'border-border opacity-60',
                )}
              >
                {ex.gifUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ex.gifUrl} alt={ex.exerciseName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <ImageOff className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </button>
            );
          })}

          {/* Add exercise button */}
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            aria-label={t('session.addExercise.title')}
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-border transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-5 w-5 text-muted-foreground" />
          </button>
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
              ? () => onIndexChange(Math.min(activeIndex + 1, exercises.length - 1))
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
          onClick={() => onIndexChange(Math.max(0, activeIndex - 1))}
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
            onClick={() => onIndexChange(activeIndex + 1)}
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

      <AddExerciseSheet open={addOpen} onOpenChange={setAddOpen} onConfirm={handleAddConfirm} />
    </div>
  );
}
