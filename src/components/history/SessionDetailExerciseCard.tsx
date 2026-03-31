import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SessionDetailSetRow } from '@/components/history/SessionDetailSetRow';
import { History } from 'lucide-react';
import type { SessionExercise } from '@/types/domain.types';

interface SessionDetailExerciseCardProps {
  exercise: SessionExercise;
}

export function SessionDetailExerciseCard({ exercise }: SessionDetailExerciseCardProps) {
  const completedSets = exercise.sets.filter((s) => s.completed).length;

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold">{exercise.exerciseName}</p>
            <p className="text-muted-foreground text-sm">
              {completedSets}/{exercise.plannedSets} series
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            disabled
          >
            <History className="h-4 w-4" />
            Ver historial
          </Button>
        </div>

        {exercise.sets.length > 0 && (
          <div className="space-y-1.5">
            {exercise.sets.map((set) => (
              <SessionDetailSetRow key={set.setIndex} set={set} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
