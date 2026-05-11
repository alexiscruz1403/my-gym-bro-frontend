'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { BodyFigure } from '@/components/ranks/BodyFigure';
import { MuscleDetailPanel } from '@/components/ranks/MuscleDetailPanel';
import { LeaderboardPanel } from '@/components/ranks/LeaderboardPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useRanks } from '@/hooks/useRanks';
import { cn } from '@/lib/utils';
import type { MuscleGroup } from '@/types/domain.types';

type RanksTab = 'musculos' | 'leaderboard';

export default function RanksPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<RanksTab>('musculos');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const { rankMap, isLoading, error } = useRanks();

  const TABS: { value: RanksTab; label: string }[] = [
    { value: 'musculos', label: t('ranks.tabs.muscles') },
    { value: 'leaderboard', label: t('ranks.tabs.leaderboard') },
  ];

  const handleMuscleClick = (muscle: MuscleGroup) => {
    setSelectedMuscle((prev) => (prev === muscle ? null : muscle));
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">{t('ranks.title')}</h1>

        <div className="flex rounded-lg bg-muted p-1">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'flex-1 rounded-md py-1.5 text-sm font-medium transition-colors min-h-11 cursor-pointer',
                activeTab === tab.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'musculos' && (
          <div className="space-y-4">
            {isLoading && (
              <div className="flex justify-center gap-6">
                <Skeleton className="h-72 w-28 rounded-xl" />
                <Skeleton className="h-72 w-28 rounded-xl" />
              </div>
            )}

            {!isLoading && error && (
              <EmptyState
                title={t('ranks.error.title')}
                description={t('ranks.error.description')}
              />
            )}

            {!isLoading && !error && (
              <BodyFigure
                rankMap={rankMap}
                selectedMuscle={selectedMuscle}
                onMuscleClick={handleMuscleClick}
              />
            )}

            {selectedMuscle && rankMap.has(selectedMuscle) && (
              <MuscleDetailPanel
                item={rankMap.get(selectedMuscle)!}
                onClose={() => setSelectedMuscle(null)}
              />
            )}

            {selectedMuscle && !rankMap.has(selectedMuscle) && (
              <div className="rounded-xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">{t('ranks.noData')}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && <LeaderboardPanel />}
      </div>
    </PageContainer>
  );
}
