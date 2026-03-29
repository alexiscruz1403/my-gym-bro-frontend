import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MuscleGroupBadge } from './MuscleGroupBadge';
import { Dumbbell, Plus } from 'lucide-react';
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

interface ExerciseCardBrowseProps {
  exercise: Exercise;
  mode: 'browse';
  onClick: () => void;
}

interface ExerciseCardPickerProps {
  exercise: Exercise;
  mode: 'picker';
  onSelect: (exercise: Exercise) => void;
}

type ExerciseCardProps = ExerciseCardBrowseProps | ExerciseCardPickerProps;

export function ExerciseCard(props: ExerciseCardProps) {
  const { exercise, mode } = props;

  const handleCardClick = () => {
    if (mode === 'browse') props.onClick();
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === 'picker') props.onSelect(exercise);
  };

  return (
    <Card
      className={mode === 'browse' ? 'cursor-pointer transition-colors hover:bg-accent' : ''}
      onClick={handleCardClick}
    >
      <CardContent className="flex items-center gap-3 p-4">
        {exercise.gifUrl ? (
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="h-12 w-12 rounded-md object-cover"
          />
        ) : (
          <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-md">
            <Dumbbell className="text-muted-foreground h-5 w-5" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{exercise.name}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {exercise.musclesPrimary.slice(0, 2).map((m) => (
              <MuscleGroupBadge key={m} muscle={m} variant="secondary" />
            ))}
            <Badge variant="outline" className="text-xs">
              {LOAD_TYPE_LABELS[exercise.loadType]}
            </Badge>
          </div>
        </div>

        {mode === 'picker' && (
          <Button size="icon" variant="ghost" onClick={handleAdd} aria-label="Add exercise">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
