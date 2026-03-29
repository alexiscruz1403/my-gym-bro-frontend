import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MuscleGroupBadge } from './MuscleGroupBadge';
import { Dumbbell } from 'lucide-react';
import type { Exercise } from '@/types/domain.types';

const LOAD_TYPE_LABELS: Record<string, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  machine: 'Machine',
  bodyweight: 'Bodyweight',
  cable: 'Cable',
  kettlebell: 'Kettlebell',
  resistance_band: 'Resistance Band',
};

interface ExerciseDetailProps {
  exercise: Exercise;
}

export function ExerciseDetail({ exercise }: ExerciseDetailProps) {
  return (
    <div className="space-y-6">
      {exercise.gifUrl ? (
        <div className="overflow-hidden rounded-xl">
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full object-cover"
          />
        </div>
      ) : (
        <div className="bg-muted flex h-40 items-center justify-center rounded-xl">
          <Dumbbell className="text-muted-foreground h-12 w-12" />
        </div>
      )}

      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold">{exercise.name}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{LOAD_TYPE_LABELS[exercise.loadType]}</Badge>
          <Badge variant="outline">{exercise.bilateral ? 'Bilateral' : 'Unilateral'}</Badge>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-sm font-medium">Primary muscles</p>
        <div className="flex flex-wrap gap-2">
          {exercise.musclesPrimary.map((m) => (
            <MuscleGroupBadge key={m} muscle={m} variant="default" />
          ))}
        </div>
      </div>

      {exercise.musclesSecondary.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Secondary muscles</p>
          <div className="flex flex-wrap gap-2">
            {exercise.musclesSecondary.map((m) => (
              <MuscleGroupBadge key={m} muscle={m} variant="secondary" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
