'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ExerciseHistoryList } from '@/components/history/ExerciseHistoryList';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useExerciseHistory } from '@/hooks/useExerciseHistory';

function ExerciseHistorySkeletons() {
  return (
    <div className="space-y-2 px-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

interface ExerciseHistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseId: string;
  exerciseName: string;
}

export function ExerciseHistorySheet({
  open,
  onOpenChange,
  exerciseId,
  exerciseName,
}: ExerciseHistorySheetProps) {
  const { data, meta, loading, error, page, setPage, refetch } = useExerciseHistory(exerciseId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80dvh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{exerciseName}</SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-6">
          {loading && <ExerciseHistorySkeletons />}

          {!loading && error && (
            <EmptyState
              title="Error al cargar el historial"
              description="No se pudo obtener el historial. Intenta de nuevo."
              action={
                <Button variant="outline" size="sm" onClick={refetch}>
                  Reintentar
                </Button>
              }
            />
          )}

          {!loading && !error && data.length === 0 && (
            <EmptyState
              title="No hay historial para este ejercicio"
              description="Aún no has registrado sesiones con este ejercicio."
            />
          )}

          {!loading && !error && data.length > 0 && meta && (
            <ExerciseHistoryList
              data={data}
              meta={meta}
              page={page}
              onPageChange={setPage}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
