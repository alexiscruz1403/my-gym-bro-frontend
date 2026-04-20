import type { ExerciseConfig } from '@/types/domain.types';
import { formatSide, isUnilateral } from '@/lib/set-format';

interface ExerciseConfigRowProps {
  config: ExerciseConfig;
}

export function ExerciseConfigRow({ config }: ExerciseConfigRowProps) {
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
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {config.exerciseName}
            {unilateral && (
              <span className="ml-2 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                Unilateral
              </span>
            )}
          </p>
          <p className="text-muted-foreground text-xs">{metric}</p>
          {unilateral && (
            <div className="text-muted-foreground text-xs">
              <p>L: {formatSide(config.left, weightUnit)}</p>
              <p>R: {formatSide(config.right, weightUnit)}</p>
            </div>
          )}
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
