'use client';

import { useExerciseHistory } from '@/hooks/useExerciseHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import type { ExerciseHistorySession, ExerciseHistorySet } from '@/types/domain.types';

const DAY_LABELS: Record<string, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });
}

function SetRow({ set, bilateral, unit }: { set: ExerciseHistorySet; bilateral?: boolean; unit: string }) {
  const label = `Serie ${set.setIndex + 1}`;

  if (bilateral && (set.left || set.right)) {
    const side = (s: { reps?: number; duration?: number; weight?: number } | undefined | null) => {
      if (!s) return '—';
      const metric = s.reps != null ? `${s.reps} reps` : s.duration != null ? `${s.duration}s` : '—';
      const weight = s.weight != null ? ` · ${s.weight} ${unit}` : '';
      return `${metric}${weight}`;
    };
    return (
      <div className="flex items-start justify-between text-sm py-1 border-b border-border/50 last:border-0">
        <span className="text-muted-foreground w-16 shrink-0">{label}</span>
        <div className="text-right space-y-0.5">
          <p><span className="text-muted-foreground text-xs">Izq </span>{side(set.left)}</p>
          <p><span className="text-muted-foreground text-xs">Der </span>{side(set.right)}</p>
        </div>
      </div>
    );
  }

  const metric = set.reps != null ? `${set.reps} reps` : set.duration != null ? `${set.duration}s` : '—';
  const weight = set.weight != null ? ` · ${set.weight} ${unit}` : '';

  return (
    <div className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span>{metric}{weight}</span>
    </div>
  );
}

function SessionCard({ session, bilateral }: { session: ExerciseHistorySession; bilateral?: boolean }) {
  const completedSets = session.sets.filter((s) => s.completed);

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{formatDate(session.sessionDate)}</p>
          <p className="text-xs text-muted-foreground">{DAY_LABELS[session.dayOfWeek] ?? session.dayOfWeek}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {completedSets.length} serie{completedSets.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div>
        {completedSets.map((set) => (
          <SetRow key={set.setIndex} set={set} bilateral={bilateral} unit={session.weightUnit} />
        ))}
      </div>
    </div>
  );
}

interface HistoryTabProps {
  exerciseId: string;
}

export function HistoryTab({ exerciseId }: HistoryTabProps) {
  const { data, meta, bilateral, loading, error, page, setPage } = useExerciseHistory(exerciseId);

  if (loading) {
    return (
      <div className="space-y-3 pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Error al cargar el historial"
        description="No se pudo obtener el historial. Intenta de nuevo."
        className="pt-4"
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="Sin historial"
        description="Aún no has realizado este ejercicio. Completa una sesión para ver tu historial."
        className="pt-4"
      />
    );
  }

  return (
    <div className="space-y-3 pt-4">
      {data.map((session) => (
        <SessionCard key={session.sessionId} session={session} bilateral={bilateral} />
      ))}

      {meta && (
        <Pagination
          page={page}
          total={meta.total}
          limit={meta.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
