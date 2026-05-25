'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { History } from 'lucide-react';
import { SessionDetailSetRow } from '@/components/history/SessionDetailSetRow';
import { ExerciseHistorySheet } from '@/components/history/ExerciseHistorySheet';
import type { SessionExercise } from '@/types/domain.types';

function ExerciseInitials({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted font-display text-[12px] font-bold text-muted-foreground">
      {initials}
    </div>
  );
}

interface SessionDetailExerciseCardProps {
  exercise: SessionExercise;
}

export function SessionDetailExerciseCard({ exercise }: SessionDetailExerciseCardProps) {
  const { t } = useTranslation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const completedSets = exercise.sets.filter((s) => s.completed).length;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-[10px] border-b border-border px-[14px] py-[12px]">
          {exercise.gifUrl ? (
            <Link href={`/workout/exercises/${exercise.exerciseId}`} className="shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={exercise.gifUrl}
                alt={exercise.exerciseName}
                className="h-11 w-11 rounded-lg object-cover"
              />
            </Link>
          ) : (
            <ExerciseInitials name={exercise.exerciseName} />
          )}

          <div className="min-w-0 flex-1">
            <Link
              href={`/workout/exercises/${exercise.exerciseId}`}
              className="block truncate font-display text-[14.5px] font-bold tracking-[0.01em] text-foreground transition-colors hover:text-primary"
            >
              {exercise.exerciseName}
            </Link>
            <p className="mt-[2px] text-[12px] text-muted-foreground">
              {completedSets}/{exercise.plannedSets} {t('history.sets')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="ml-auto flex h-[30px] shrink-0 cursor-pointer items-center gap-[5px] rounded-full border-[1.5px] border-border bg-transparent px-[10px] text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <History className="h-3 w-3" />
            {t('history.viewHistory')}
          </button>
        </div>

        {exercise.sets.length > 0 && (
          <div className="flex flex-col gap-[5px] px-[14px] pb-[12px] pt-[8px]">
            {exercise.sets.map((set) => (
              <SessionDetailSetRow
                key={set.setIndex}
                set={set}
                weightUnit={exercise.weightUnit}
                bilateral={exercise.bilateral}
              />
            ))}
          </div>
        )}
      </div>

      <ExerciseHistorySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        exerciseId={exercise.exerciseId}
        exerciseName={exercise.exerciseName}
      />
    </>
  );
}
