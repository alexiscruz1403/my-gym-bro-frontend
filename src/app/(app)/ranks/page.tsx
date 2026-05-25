'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { BodyFigure } from '@/components/ranks/BodyFigure';
import { MuscleDetailPanel } from '@/components/ranks/MuscleDetailPanel';
import { LeaderboardPanel } from '@/components/ranks/LeaderboardPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useRanks } from '@/hooks/useRanks';
import { hasCompletePhysicalData } from '@/lib/ranks';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/auth.store';
import type { MuscleGroup } from '@/types/domain.types';

type RanksTab = 'musculos' | 'leaderboard';

export default function RanksPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const isComplete = hasCompletePhysicalData(user);
  const [activeTab, setActiveTab] = useState<RanksTab>('musculos');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const { rankMap, isLoading, error } = useRanks(isComplete);

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

        {!isComplete ? (
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
        ) : (
          <>
            <div className="flex h-11 rounded-xl bg-muted/60 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    'flex-1 cursor-pointer rounded-lg text-[13px] font-semibold transition-colors',
                    activeTab === tab.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
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

                    <MuscleDetailPanel
                      item={selectedMuscle ? (rankMap.get(selectedMuscle) ?? null) : null}
                      open={!!selectedMuscle}
                      onClose={() => setSelectedMuscle(null)}
                    />
                  </div>
                )}

                {activeTab === 'leaderboard' && <LeaderboardPanel />}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </PageContainer>
  );
}
