import { Badge } from '@/components/ui/badge';
import { Clock, Layers } from 'lucide-react';
import type { WorkoutSession, SessionStatus } from '@/types/domain.types';

const STATUS_LABEL: Record<SessionStatus, string> = {
  completed: 'Completado',
  partial: 'Parcial',
  in_progress: 'En progreso',
  abandoned: 'Abandonado',
};

const STATUS_VARIANT: Record<
  SessionStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  completed: 'default',
  partial: 'secondary',
  in_progress: 'secondary',
  abandoned: 'destructive',
};

const DAY_LABEL: Record<string, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getTotalSetsLogged(session: WorkoutSession): number {
  return session.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0,
  );
}

interface SessionDetailHeaderProps {
  session: WorkoutSession;
}

export function SessionDetailHeader({ session }: SessionDetailHeaderProps) {
  const totalSets = getTotalSetsLogged(session);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="font-display truncate text-xl font-bold">{session.planName}</h1>
          <p className="text-muted-foreground text-sm">
            {DAY_LABEL[session.dayOfWeek]} · {formatDate(session.startedAt)}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[session.status]} className="shrink-0">
          {STATUS_LABEL[session.status]}
        </Badge>
      </div>

      <div className="flex gap-4 text-sm text-muted-foreground">
        {session.durationSeconds !== undefined && (
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(session.durationSeconds)}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Layers className="h-4 w-4" />
          <span>{totalSets} series completadas</span>
        </div>
      </div>
    </div>
  );
}
