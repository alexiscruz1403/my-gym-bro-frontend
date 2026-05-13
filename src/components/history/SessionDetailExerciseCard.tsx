'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SessionDetailSetRow } from '@/components/history/SessionDetailSetRow';
import { ExerciseHistorySheet } from '@/components/history/ExerciseHistorySheet';
import { ExerciseGifThumbnail } from '@/components/shared/ExerciseGifThumbnail';
import { useExerciseCatalog } from '@/hooks/useExerciseCatalog';
import { History } from 'lucide-react';
import type { SessionExercise } from '@/types/domain.types';

interface SessionDetailExerciseCardProps {
  exercise: SessionExercise;
}

export function SessionDetailExerciseCard({ exercise }: SessionDetailExerciseCardProps) {
  const { t } = useTranslation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data: catalogExercise } = useExerciseCatalog(exercise.exerciseId);
  const completedSets = exercise.sets.filter((s) => s.completed).length;

  return (
    <>
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ExerciseGifThumbnail
                gifUrl={catalogExercise?.gifUrl}
                exerciseName={exercise.exerciseName}
                exerciseId={exercise.exerciseId}
              />
              <div className="min-w-0">
                <Link
                  href={`/workout/exercises/${exercise.exerciseId}`}
                  className="truncate font-semibold hover:underline block"
                >
                  {exercise.exerciseName}
                </Link>
                <p className="text-muted-foreground text-sm">
                  {completedSets}/{exercise.plannedSets} {t('history.sets')}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => setSheetOpen(true)}
            >
              <History className="h-4 w-4" />
              {t('history.viewHistory')}
            </Button>
          </div>

          {exercise.sets.length > 0 && (
            <div className="space-y-1.5">
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
        </CardContent>
      </Card>

      <ExerciseHistorySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        exerciseId={exercise.exerciseId}
        exerciseName={exercise.exerciseName}
      />
    </>
  );
}
