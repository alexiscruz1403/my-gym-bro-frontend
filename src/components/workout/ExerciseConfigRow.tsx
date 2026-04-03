import type { ExerciseConfig } from '@/types/domain.types';

interface ExerciseConfigRowProps {
  config: ExerciseConfig;
}

export function ExerciseConfigRow({ config }: ExerciseConfigRowProps) {
  const metric = config.reps !== undefined && config.reps !== null
    ? `${config.sets} × ${config.reps} reps`
    : config.duration !== undefined && config.duration !== null
      ? `${config.sets} × ${config.duration}s`
      : `${config.sets} sets`;

  return (
    <div>
      <div className="flex items-start justify-between gap-2 px-1 py-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{config.exerciseName}</p>
          <p className="text-muted-foreground text-xs">{metric}</p>
        </div>
        <div className="text-muted-foreground shrink-0 text-right text-xs">
          {config.weight !== undefined && config.weight !== null && config.weight > 0 && (
            <span>{config.weight} kg</span>
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
