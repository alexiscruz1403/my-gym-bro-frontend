'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useExerciseHistory } from '@/hooks/useExerciseHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { PrsTab } from '@/components/exercises/tabs/PrsTab';
import type { ExerciseHistorySession, ExerciseHistorySet } from '@/types/domain.types';

type HistorySubTab = 'sessions' | 'prs';

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function SetRow({
  set,
  bilateral,
  unit,
  index,
}: {
  set: ExerciseHistorySet;
  bilateral?: boolean;
  unit: string;
  index: number;
}) {
  const { t } = useTranslation();
  const label = t('history.setLabel', { n: index + 1 });

  if (bilateral && (set.left || set.right)) {
    const side = (s: { reps?: number; duration?: number; weight?: number } | undefined | null) => {
      if (!s) return '—';
      const metric = s.reps != null ? `${s.reps} reps` : s.duration != null ? `${s.duration}s` : '—';
      const weight = s.weight != null ? ` · ${s.weight} ${unit}` : '';
      return `${metric}${weight}`;
    };
    return (
      <div className="flex items-start justify-between border-b border-border py-1.25 text-[13px] last:border-0">
        <span className="text-muted-foreground">{label}</span>
        <div className="space-y-0.5 text-right">
          <p>
            <span className="mr-1 text-[11px] text-muted-foreground">{t('history.leftAbbr')}</span>
            <span className="font-semibold text-foreground">{side(set.left)}</span>
          </p>
          <p>
            <span className="mr-1 text-[11px] text-muted-foreground">{t('history.rightAbbr')}</span>
            <span className="font-semibold text-foreground">{side(set.right)}</span>
          </p>
        </div>
      </div>
    );
  }

  const metric = set.reps != null ? `${set.reps} reps` : set.duration != null ? `${set.duration}s` : '—';
  const weight = set.weight != null ? ` · ${set.weight} ${unit}` : '';

  return (
    <div className="flex items-center justify-between border-b border-border py-1.25 text-[13px] last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{metric}{weight}</span>
    </div>
  );
}

function SessionCard({ session, bilateral }: { session: ExerciseHistorySession; bilateral?: boolean }) {
  const { t, i18n } = useTranslation();
  const completedSets = session.sets.filter((s) => s.completed);

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card px-3.5 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13.5px] font-semibold text-foreground">
            {formatDate(session.sessionDate, i18n.language)}
          </p>
          <p className="text-[12px] text-muted-foreground">
            {t(`days.${session.dayOfWeek}`, { defaultValue: session.dayOfWeek })}
          </p>
        </div>
        <span className="text-[12px] text-muted-foreground">
          {t('history.setsCount', { count: completedSets.length })}
        </span>
      </div>

      {completedSets.length > 0 && (
        <div className="border-t border-border pt-2">
          {completedSets.map((set, i) => (
            <SetRow
              key={set.setIndex}
              set={set}
              bilateral={bilateral}
              unit={session.weightUnit}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface HistoryTabProps {
  exerciseId: string;
}

function SessionsContent({ exerciseId }: { exerciseId: string }) {
  const { t } = useTranslation();
  const { data, meta, bilateral, loading, error, page, setPage } = useExerciseHistory(exerciseId);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title={t('history.errorTitle')}
        description={t('history.errorDescription')}
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={t('history.emptyTitle')}
        description={t('history.emptyDescription')}
      />
    );
  }

  return (
    <div className="space-y-3">
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

export function HistoryTab({ exerciseId }: HistoryTabProps) {
  const { t } = useTranslation();
  const [subTab, setSubTab] = useState<HistorySubTab>('sessions');

  const SUB_TABS: { value: HistorySubTab; label: string }[] = [
    { value: 'sessions', label: t('history.sessionsTab') },
    { value: 'prs', label: t('history.prsTab') },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-0.5 rounded-2xl bg-muted/60 p-1">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setSubTab(tab.value)}
            className={cn(
              'flex-1 h-9 cursor-pointer rounded-xl text-[12.5px] font-semibold transition-all',
              subTab === tab.value
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'sessions' && <SessionsContent exerciseId={exerciseId} />}
      {subTab === 'prs' && <PrsTab exerciseId={exerciseId} />}
    </div>
  );
}
