'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExerciseNameList } from '@/components/history/ExerciseNameList';
import { Clock, Layers } from 'lucide-react';
import type { SessionHistoryItem, SessionStatus } from '@/types/domain.types';

const STATUS_VARIANT: Record<
  SessionStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  completed: 'default',
  partial: 'secondary',
  in_progress: 'secondary',
  abandoned: 'destructive',
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

interface SessionHistoryCardProps {
  session: SessionHistoryItem;
}

export function SessionHistoryCard({ session }: SessionHistoryCardProps) {
  const { t, i18n } = useTranslation();

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <Link href={`/history/${session._id}`} className="block">
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold">{session.planName}</p>
              <p className="text-muted-foreground text-sm">
                {t(`days.${session.dayOfWeek}`)}{session.dayName ? ` · ${session.dayName}` : ''} · {formatDate(session.startedAt)}
              </p>
            </div>
            <Badge variant={STATUS_VARIANT[session.status]} className="shrink-0">
              {t(`history.status.${session.status}`)}
            </Badge>
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(session.durationSeconds)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              <span>{session.totalSetsLogged} {t('history.sets')}</span>
            </div>
          </div>

          <ExerciseNameList exercises={session.exercises} />
        </CardContent>
      </Card>
    </Link>
  );
}
