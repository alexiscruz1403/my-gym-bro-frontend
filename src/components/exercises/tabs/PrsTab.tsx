'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useExercisePrs } from '@/hooks/useExercisePrs';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { PrsGuideSheet } from '@/components/guides/PrsGuideSheet';
import type { ExercisePrEntry } from '@/types/domain.types';

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function PrCard({
  entry,
  trackingType,
  isFirst,
}: {
  entry: ExercisePrEntry;
  trackingType: 'reps' | 'duration';
  isFirst: boolean;
}) {
  const { t, i18n } = useTranslation();

  const valueLabel =
    trackingType === 'duration'
      ? t('history.prs.value_duration', { value: entry.value })
      : t('history.prs.value_reps', { value: entry.value });

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-3.5 py-3 shadow-sm">
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-bold text-foreground">{valueLabel}</span>
        <span className="text-[12px] text-muted-foreground">
          {formatDate(entry.achievedAt, i18n.language)}
        </span>
      </div>
      <div>
        {entry.delta != null ? (
          <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[12px] font-semibold text-green-600 dark:text-green-400">
            {t('history.prs.delta', { value: entry.delta })}
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2.5 py-1 text-[12px] font-semibold text-muted-foreground">
            {isFirst ? t('history.prs.firstRecord') : '—'}
          </span>
        )}
      </div>
    </div>
  );
}

interface PrsTabProps {
  exerciseId: string;
}

export function PrsTab({ exerciseId }: PrsTabProps) {
  const { t, i18n } = useTranslation();
  const { data, loading, error } = useExercisePrs(exerciseId);
  const [guideOpen, setGuideOpen] = useState(false);

  const reversed = data ? [...data.history].reverse() : [];
  const hasStats = data?.avgDaysBetweenPrs != null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
          {t('history.prs.sectionTitle')}
        </p>
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="flex items-center text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          aria-label={t('guides.howItWorks')}
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && (error || !data) && (
        <EmptyState
          title={t('history.errorTitle')}
          description={t('history.errorDescription')}
        />
      )}

      {!loading && data && data.history.length === 0 && (
        <EmptyState
          title={t('history.prs.emptyTitle')}
          description={t('history.prs.emptyDescription')}
        />
      )}

      {!loading && data && data.history.length > 0 && (
        <>
          {hasStats && (
            <div className="flex gap-3 rounded-2xl border border-border bg-card px-3.5 py-3 shadow-sm">
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('history.prs.avgDays')}
                </span>
                <span className="text-[15px] font-bold text-foreground">
                  {data.avgDaysBetweenPrs}d
                </span>
              </div>
              <div className="w-px self-stretch bg-border" />
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('history.prs.nextPr')}
                </span>
                <span className="text-[15px] font-bold text-foreground">
                  {data.predictedNextPrDate
                    ? formatDate(data.predictedNextPrDate, i18n.language)
                    : t('history.prs.noPrediction')}
                </span>
              </div>
            </div>
          )}

          {reversed.map((entry, i) => (
            <PrCard
              key={entry.achievedAt}
              entry={entry}
              trackingType={data.trackingType}
              isFirst={i === reversed.length - 1}
            />
          ))}
        </>
      )}

      <PrsGuideSheet open={guideOpen} onOpenChange={setGuideOpen} />
    </div>
  );
}
