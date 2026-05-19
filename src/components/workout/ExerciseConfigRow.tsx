'use client';

import NextLink from 'next/link';
import { cn } from '@/lib/utils';
import type { ExerciseConfig } from '@/types/domain.types';
import { formatSide, isUnilateral } from '@/lib/set-format';
import { ExerciseSwapDialog } from './ExerciseSwapDialog';
import { ExerciseGifThumbnail } from '@/components/shared/ExerciseGifThumbnail';

interface ExerciseConfigRowProps {
  config: ExerciseConfig;
  planId?: string;
  showSwap?: boolean;
  showBorder?: boolean;
}

export function ExerciseConfigRow({ config, planId, showSwap, showBorder }: ExerciseConfigRowProps) {
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
    <div className={cn(showBorder && 'border-b border-border/60')}>
      <div className="flex items-center gap-2.5 px-1 py-2.5">
        <ExerciseGifThumbnail
          gifUrl={config.gifUrl}
          exerciseName={config.exerciseName}
          exerciseId={config.exerciseId}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <NextLink
              href={`/workout/exercises/${config.exerciseId}`}
              className="no-underline! truncate text-[13.5px] font-semibold text-foreground hover:underline"
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
          <p className="mt-0.5 text-[12px] text-muted-foreground">{metric}</p>
          {unilateral && (
            <div className="text-[12px] text-muted-foreground">
              <p>L: {formatSide(config.left, weightUnit)}</p>
              <p>R: {formatSide(config.right, weightUnit)}</p>
            </div>
          )}
        </div>
        {!unilateral && (
          <div className="flex flex-col items-center justify-center shrink-0 text-right gap-1">
            {config.weight !== undefined && config.weight !== null && config.weight > 0 ? (
              <p className="font-display text-[13px] font-semibold text-foreground mb-0!">
                {config.weight} {weightUnit}
              </p>
            ) : (
              <p className="font-display text-[13px] font-semibold text-muted-foreground mb-0!">PC</p>
            )}
            <p className="text-[11px] text-muted-foreground">{config.rest}s rest</p>
          </div>
        )}
      </div>
      {config.notes && (
        <p className="px-1 pb-1 text-[12px] italic text-muted-foreground">{config.notes}</p>
      )}
    </div>
  );
}
