'use client';

import { Clock, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { WorkoutSession, SessionStatus } from '@/types/domain.types';

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, {
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
  const { t, i18n } = useTranslation();
  const totalSets = getTotalSetsLogged(session);
  const status = session.status as SessionStatus;

  const statusBadgeClass = cn(
    'shrink-0 rounded-full px-[10px] py-[3px] text-[10px] font-bold uppercase tracking-[0.04em]',
    status === 'completed' && 'bg-green-500/10 text-green-600 dark:bg-green-500/15 dark:text-green-500',
    status === 'partial' && 'border border-border bg-muted text-muted-foreground',
    status === 'in_progress' && 'border border-border bg-muted text-muted-foreground',
    status === 'abandoned' && 'bg-destructive/10 text-destructive',
  );

  return (
    <div className="flex flex-col gap-[10px] rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="font-display truncate text-[22px] font-bold leading-[1.1] tracking-[0.01em] text-foreground">
            {session.dayName
              ? `${session.dayName} — ${t(`days.${session.dayOfWeek}`)}`
              : t(`days.${session.dayOfWeek}`)}
          </h1>
          <p className="mt-[3px] text-[13px] text-muted-foreground">
            {session.planName} · {formatDate(session.startedAt, i18n.language)}
          </p>
        </div>
        <span className={statusBadgeClass}>
          {t(`history.status.${status}`)}
        </span>
      </div>

      <div className="flex gap-4 text-[13px] text-muted-foreground">
        {session.durationSeconds !== undefined && (
          <span className="flex items-center gap-[5px]">
            <Clock className="h-3.5 w-3.5" />
            {formatDuration(session.durationSeconds)}
          </span>
        )}
        <span className="flex items-center gap-[5px]">
          <Layers className="h-3.5 w-3.5" />
          {t('history.setsCompleted', { count: totalSets })}
        </span>
      </div>
    </div>
  );
}
