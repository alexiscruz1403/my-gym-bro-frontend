import { formatSide } from '@/lib/set-format';
import type { ExerciseHistorySet } from '@/types/domain.types';

interface ExerciseHistorySetRowProps {
  set: ExerciseHistorySet;
  weightUnit: 'kg' | 'lbs';
  bilateral?: boolean;
}

export function ExerciseHistorySetRow({ set, weightUnit, bilateral }: ExerciseHistorySetRowProps) {
  const unilateral = bilateral === false || (bilateral === undefined && (set.left || set.right));

  if (unilateral) {
    return (
      <div className="flex items-start gap-4 px-2 py-1 text-sm text-muted-foreground">
        <span className="w-6 shrink-0 pt-0.5 text-center">{set.setIndex + 1}</span>
        <div className="flex-1 space-y-0.5">
          <p>
            <span className="mr-1 text-xs font-medium">L</span>
            <span className="text-foreground">{formatSide(set.left, weightUnit || 'kg')}</span>
          </p>
          <p>
            <span className="mr-1 text-xs font-medium">R</span>
            <span className="text-foreground">{formatSide(set.right, weightUnit || 'kg')}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 px-2 py-1 text-sm text-muted-foreground">
      <span className="w-6 shrink-0 text-center">{set.setIndex + 1}</span>

      <div className="flex flex-1 items-center gap-4">
        {set.weight !== undefined && (
          <span>
            <span className="font-medium text-foreground">{set.weight}</span>
            <span className="ml-0.5">{weightUnit || 'kg'}</span>
          </span>
        )}
        {set.reps !== undefined && (
          <span>
            <span className="font-medium text-foreground">{set.reps}</span>
            <span className="ml-0.5">reps</span>
          </span>
        )}
        {set.duration !== undefined && (
          <span>
            <span className="font-medium text-foreground">{set.duration}</span>
            <span className="ml-0.5">s</span>
          </span>
        )}
      </div>
    </div>
  );
}
