'use client';

import { useExerciseRank } from '@/hooks/useExerciseRank';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { getRankColor, getRankName } from '@/lib/ranks';
import type { RankLevel } from '@/types/domain.types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface RankTabProps {
  exerciseId: string;
}

export function RankTab({ exerciseId }: RankTabProps) {
  const { data, loading, error } = useExerciseRank(exerciseId);

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Error al cargar el rango"
        description="No se pudo obtener el rango. Intenta de nuevo."
        className="pt-4"
      />
    );
  }

  if (!data || data.rank === null) {
    return (
      <EmptyState
        title="Sin rango aún"
        description="Aún no tienes rango para este ejercicio. Completa sesiones para obtener uno."
        className="pt-4"
      />
    );
  }

  const color = getRankColor(data.rank as RankLevel);
  const rankName = getRankName(data.rank as RankLevel);

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6 text-center">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {data.rank}
        </div>

        <div>
          <p className="font-display text-2xl font-bold" style={{ color }}>
            {rankName}
          </p>
          {data.exerciseName && (
            <p className="mt-0.5 text-sm text-muted-foreground">{data.exerciseName}</p>
          )}
        </div>

        <div className="w-full space-y-2 border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Mejor marca</span>
            <span className="font-medium">{data.bestValue} kg</span>
          </div>
          {data.updatedAt && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Última actualización</span>
              <span className="font-medium">{formatDate(data.updatedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
