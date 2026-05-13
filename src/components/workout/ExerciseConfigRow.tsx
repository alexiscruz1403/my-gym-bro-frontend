'use client';

import NextLink from 'next/link';
import type { ExerciseConfig } from '@/types/domain.types';
import { formatSide, isUnilateral } from '@/lib/set-format';
import { ExerciseSwapDialog } from './ExerciseSwapDialog';
import { useExerciseCatalog } from '@/hooks/useExerciseCatalog';
import { ExerciseGifThumbnail } from '@/components/shared/ExerciseGifThumbnail';

interface ExerciseConfigRowProps {
  config: ExerciseConfig;
  planId?: string;
  showSwap?: boolean;
}

export function ExerciseConfigRow({ config, planId, showSwap }: ExerciseConfigRowProps) {
  const { data: catalogExercise } = useExerciseCatalog(config.exerciseId);
  const unilateral = isUnilateral(config);
  const weightUnit = config.weightUnit ?? 'kg';

  const metric = unilateral
    ? `${config.sets} sets`
    : config.reps !== undefined && config.reps !== null
      ? `${config.sets} × ${config.reps} reps`
      : config.duration !== undefined && config.duration !== null
        ? `${config.sets} × ${config.duration}s`
        : `${config.sets} sets`;

  return (
    <div>
      <div className="flex items-start justify-between gap-2 px-1 py-2">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <ExerciseGifThumbnail
            gifUrl={catalogExercise?.gifUrl}
            exerciseName={config.exerciseName}
            exerciseId={config.exerciseId}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <NextLink
                href={`/workout/exercises/${config.exerciseId}`}
                className="truncate text-sm font-medium hover:underline"
              >
                {config.exerciseName}
              </NextLink>
              {unilateral && (
                <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                  Unilateral
                </span>
              )}
              {showSwap && planId && (
                <ExerciseSwapDialog
                  planId={planId}
                  exerciseId={config.exerciseId}
                  exerciseName={config.exerciseName}
                />
              )}
            </div>
            <p className="text-muted-foreground text-xs">{metric}</p>
            {unilateral && (
              <div className="text-muted-foreground text-xs">
                <p>L: {formatSide(config.left, weightUnit)}</p>
                <p>R: {formatSide(config.right, weightUnit)}</p>
              </div>
            )}
          </div>
        </div>
        <div className="text-muted-foreground shrink-0 text-right text-xs">
          {!unilateral && config.weight !== undefined && config.weight !== null && config.weight > 0 && (
            <span>{config.weight} {weightUnit}</span>
          )}
          <p>{config.rest}s rest</p>
        </div>
      </div>
      {config.notes && (
        <p className="text-muted-foreground px-1 pb-1 text-xs italic">{config.notes}</p>
      )}
    </div>
  );
}
