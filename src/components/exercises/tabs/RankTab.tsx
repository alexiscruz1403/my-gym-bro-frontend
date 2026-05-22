'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useExerciseRank } from '@/hooks/useExerciseRank';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { getRankColor, getRankName, RANK_NAMES, hasCompletePhysicalData } from '@/lib/ranks';
import useAuthStore from '@/store/auth.store';
import type { RankLevel } from '@/types/domain.types';

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface RankTabProps {
  exerciseId: string;
}

export function RankTab({ exerciseId }: RankTabProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const isComplete = hasCompletePhysicalData(user);
  const { data, loading, error } = useExerciseRank(exerciseId, isComplete);
  const [showBestMarkInfo, setShowBestMarkInfo] = useState(false);

  if (!isComplete) {
    return (
      <EmptyState
        title={t('ranks.incompleteData.title')}
        description={t('ranks.incompleteData.description')}
        action={
          <Link href="/profile">
            <button className="mt-1 cursor-pointer rounded-xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary/90">
              {t('ranks.incompleteData.action')}
            </button>
          </Link>
        }
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title={t('exercises.detail.rank.errorTitle')}
        description={t('exercises.detail.rank.errorDescription')}
      />
    );
  }

  if (!data || data.rank === null) {
    return (
      <EmptyState
        title={t('exercises.detail.rank.noRankTitle')}
        description={t('exercises.detail.rank.noRankDescription')}
      />
    );
  }

  const rank = data.rank as RankLevel;
  const color = getRankColor(rank);
  const rankName = getRankName(rank);

  const progressPct =
    data.bestValue !== null && data.valueToNextRank !== null && data.valueToNextRank > 0
      ? Math.min(100, Math.round((data.bestValue * 100) / (data.bestValue + data.valueToNextRank)))
      : null;

  return (
    <div className="space-y-3">
      {/* Rank hero card */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-4 py-6 text-center shadow-sm">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full font-display text-[22px] font-bold"
          style={{ backgroundColor: `${color}28`, color }}
        >
          {rank}
        </div>

        <div>
          <p className="font-display text-[26px] font-bold tracking-[0.02em]" style={{ color }}>
            {rankName}
          </p>
          {data.exerciseName && (
            <p className="mt-0.5 text-[13px] text-muted-foreground">{data.exerciseName}</p>
          )}
        </div>

        {/* Progress to next rank */}
        {progressPct !== null && data.nextRankName && (
          <div className="w-full space-y-2 border-t border-border pt-3.5">
            <div className="flex justify-between text-[12px] text-muted-foreground">
              <span>{rankName}</span>
              <span>{data.nextRankName}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{ width: `${progressPct}%`, backgroundColor: color }}
              />
            </div>
            <p className="text-[12px] font-semibold" style={{ color }}>
              {t('exercises.detail.rank.progressTo', { pct: progressPct, rank: data.nextRankName })}
            </p>
          </div>
        )}

        {/* Details */}
        <div className="w-full border-t border-border pt-1">
          <div className="flex items-center justify-between py-2 text-[13px]">
            <span className="text-muted-foreground">{t('exercises.detail.rank.bestMark')}</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">{data.bestValue}</span>
              <button
                onClick={() => setShowBestMarkInfo((v) => !v)}
                className="flex items-center text-muted-foreground/50 transition-colors hover:text-muted-foreground"
                aria-label={t('exercises.detail.rank.bestMarkInfo')}
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          {showBestMarkInfo && (
            <p className="mb-1 rounded-xl bg-muted/60 px-3 py-2 text-[12px] leading-[1.5] text-muted-foreground">
              {t('exercises.detail.rank.bestMarkInfo')}
            </p>
          )}
          {data.updatedAt && (
            <div className="flex items-center justify-between py-2 text-[13px]">
              <span className="text-muted-foreground">{t('exercises.detail.rank.lastUpdated')}</span>
              <span className="font-semibold text-foreground">{formatDate(data.updatedAt, i18n.language)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Rank scale legend */}
      <div className="rounded-2xl border border-border bg-card px-3.5 py-3 shadow-sm">
        <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
          {t('exercises.detail.rank.rankScale')}
        </p>
        {(Object.entries(RANK_NAMES) as [string, string][]).map(([r, name]) => {
          const lvl = parseInt(r) as RankLevel;
          const c = getRankColor(lvl);
          const isCurrent = lvl === rank;
          return (
            <div
              key={r}
              className="flex items-center gap-2.5 border-b border-border py-[5px] last:border-0"
            >
              <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: c }} />
              <span
                className="text-[13px]"
                style={{ color: isCurrent ? c : undefined, fontWeight: isCurrent ? 700 : 400 }}
              >
                {name}
              </span>
              {isCurrent && (
                <span
                  className="ml-auto rounded-full px-[7px] py-px text-[10px] font-bold"
                  style={{ backgroundColor: `${c}28`, color: c }}
                >
                  {t('exercises.detail.rank.current')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
