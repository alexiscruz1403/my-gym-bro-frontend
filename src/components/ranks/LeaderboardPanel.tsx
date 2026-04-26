'use client';

import { LeaderboardRow } from '@/components/ranks/LeaderboardRow';
import { Pagination } from '@/components/shared/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import type { MuscleGroup } from '@/types/domain.types';

const MUSCLE_OPTIONS: { value: MuscleGroup; label: string }[] = [
  { value: 'chest', label: 'Pecho' },
  { value: 'front_delts', label: 'Deltoides ant.' },
  { value: 'side_delts', label: 'Deltoides lat.' },
  { value: 'rear_delts', label: 'Deltoides post.' },
  { value: 'triceps', label: 'Tríceps' },
  { value: 'biceps', label: 'Bíceps' },
  { value: 'forearms', label: 'Antebrazos' },
  { value: 'traps', label: 'Trapecios' },
  { value: 'lats', label: 'Dorsales' },
  { value: 'upper_back', label: 'Espalda alta' },
  { value: 'lower_back', label: 'Lumbar' },
  { value: 'abs', label: 'Abdominales' },
  { value: 'obliques', label: 'Oblicuos' },
  { value: 'quads', label: 'Cuádriceps' },
  { value: 'hamstrings', label: 'Isquiotibiales' },
  { value: 'glutes', label: 'Glúteos' },
  { value: 'adductors', label: 'Aductores' },
  { value: 'abductors', label: 'Abductores' },
  { value: 'calves', label: 'Gemelos' },
];

export function LeaderboardPanel() {
  const { data, isLoading, error, selectedMuscle, setSelectedMuscle, page, setPage } =
    useLeaderboard();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground shrink-0">Músculo:</span>
        <select
          value={selectedMuscle ?? ''}
          onChange={(e) =>
            setSelectedMuscle(
              e.target.value ? (e.target.value as MuscleGroup) : undefined,
            )
          }
          className="flex-1 rounded-md border bg-background px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">Todos</option>
          {MUSCLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <EmptyState
          title="Error al cargar el leaderboard"
          description="No se pudo obtener la clasificación. Intenta de nuevo."
        />
      )}

      {!isLoading && !error && data && (
        <div className="space-y-2">
          {/* Self — always pinned */}
          <LeaderboardRow
            entry={data.self}
            position={0}
            selectedMuscle={selectedMuscle}
          />

          {data.data.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No sigues a ningún usuario aún.
            </p>
          )}

          {data.data.map((entry, idx) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              position={idx + 1}
              selectedMuscle={selectedMuscle}
            />
          ))}

          <Pagination
            page={page}
            total={data.meta.total}
            limit={20}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
