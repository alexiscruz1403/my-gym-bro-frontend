import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExerciseNameList } from '@/components/history/ExerciseNameList';
import { Clock, Layers } from 'lucide-react';
import type { SessionHistoryItem, SessionStatus } from '@/types/domain.types';

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
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface SessionHistoryCardProps {
  session: SessionHistoryItem;
}

export function SessionHistoryCard({ session }: SessionHistoryCardProps) {
  return (
    <Link href={`/history/${session._id}`} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold">{session.planName}</p>
              <p className="text-muted-foreground text-sm">
                {DAY_LABEL[session.dayOfWeek]}{session.dayName ? ` — ${session.dayName}` : ''} · {formatDate(session.startedAt)}
              </p>
            </div>
            <Badge variant={STATUS_VARIANT[session.status]} className="shrink-0">
              {STATUS_LABEL[session.status]}
            </Badge>
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(session.durationSeconds)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              <span>{session.totalSetsLogged} series</span>
            </div>
          </div>

          <ExerciseNameList exercises={session.exercises} />
        </CardContent>
      </Card>
    </Link>
  );
}
