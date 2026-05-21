'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GuideTab } from '@/components/exercises/tabs/GuideTab';
import { HistoryTab } from '@/components/exercises/tabs/HistoryTab';
import { StatsTab } from '@/components/exercises/tabs/StatsTab';
import { RankTab } from '@/components/exercises/tabs/RankTab';
import type { Exercise } from '@/types/domain.types';

type ExerciseTab = 'guide' | 'history' | 'stats' | 'rank';

interface ExerciseDetailProps {
  exercise: Exercise;
}

export function ExerciseDetail({ exercise }: ExerciseDetailProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ExerciseTab>('guide');

  const TABS: { value: ExerciseTab; label: string }[] = [
    { value: 'guide', label: t('exercises.detail.guide.guideTab') },
    { value: 'history', label: t('exercises.detail.historyTab') },
    { value: 'stats', label: t('exercises.detail.statsTab') },
    { value: 'rank', label: t('exercises.detail.rankTab') },
  ];

  return (
    <div className="space-y-3.5">
      {/* Hero card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {exercise.gifUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full object-cover"
            style={{ aspectRatio: '16/9' }}
          />
        ) : (
          <div
            className="flex w-full items-center justify-center bg-muted/60"
            style={{ aspectRatio: '16/9' }}
          >
            <Dumbbell className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        <div className="px-4 py-3.5">
          <h1 className="font-display text-[24px] font-bold leading-[1.1] tracking-[0.01em] text-foreground">
            {exercise.name}
          </h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-border bg-muted px-[10px] py-[3px] text-[11px] font-semibold text-muted-foreground">
              {t(`exercises.loadType.${exercise.loadType}`)}
            </span>
            <span className="rounded-full border border-border bg-muted px-[10px] py-[3px] text-[11px] font-semibold text-muted-foreground">
              {exercise.bilateral ? t('exercises.bilateral') : t('exercises.unilateral')}
            </span>
            {exercise.musclesPrimary.slice(0, 2).map((m) => (
              <span
                key={m}
                className="rounded-full border border-border bg-muted px-[10px] py-[3px] text-[11px] font-semibold text-muted-foreground"
              >
                {t(`exercises.muscle.${m}`)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-0.5 rounded-2xl bg-muted/60 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'flex-1 h-9 cursor-pointer rounded-xl text-[12.5px] font-semibold transition-all',
              activeTab === tab.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'guide' && <GuideTab exercise={exercise} />}
      {activeTab === 'history' && <HistoryTab exerciseId={exercise.id} />}
      {activeTab === 'stats' && <StatsTab exerciseId={exercise.id} />}
      {activeTab === 'rank' && <RankTab exerciseId={exercise.id} />}
    </div>
  );
}
