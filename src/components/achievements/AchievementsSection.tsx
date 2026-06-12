'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AchievementBadge } from './AchievementBadge';
import { AchievementDetailDialog } from './AchievementDetailDialog';
import type { Achievement, AchievementLevel } from '@/types/domain.types';

const ITEMS_PER_PAGE = 10;

interface DisplayItem {
  achievement: Achievement;
  level: AchievementLevel;
  unlockedAt: string | null;
}

interface SelectedItem {
  achievement: Achievement;
  level: AchievementLevel;
  unlockedAt: string | null;
}

interface AchievementsSectionProps {
  achievements: Achievement[] | undefined;
  language: 'es' | 'en';
}

export function AchievementsSection({ achievements, language }: AchievementsSectionProps) {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selected, setSelected] = useState<SelectedItem | null>(null);

  const allItems = useMemo<DisplayItem[]>(() => {
    const items: DisplayItem[] = [];

    for (const achievement of achievements ?? []) {
      for (const level of achievement.levels) {
        const earned = achievement.unlockedTiers.find((ut) => ut.tier === level.tier);
        items.push({ achievement, level, unlockedAt: earned?.unlockedAt ?? null });
      }
    }

    // earned tiers first (most recent first), then locked (preserve original order)
    items.sort((a, b) => {
      if (a.unlockedAt && b.unlockedAt) {
        return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
      }
      if (a.unlockedAt) return -1;
      if (b.unlockedAt) return 1;
      return 0;
    });

    return items;
  }, [achievements]);

  const visibleItems = allItems.slice(0, visibleCount);
  const remaining = allItems.length - visibleCount;

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-4 pb-2.5 pt-3.5">
          <p className="font-display text-[16px] font-semibold tracking-[0.01em] text-foreground">
            {t('achievements.sectionTitle')}
          </p>
        </div>

        <div className="px-4 py-3.5">
          {allItems.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-muted-foreground">
              {t('achievements.noAchievements')}
            </p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                {visibleItems.map(({ achievement, level, unlockedAt }) => (
                  <AchievementBadge
                    key={`${achievement.key}-${level.tier}`}
                    level={level}
                    name={language === 'es' ? achievement.nameEs : achievement.nameEn}
                    isLocked={!unlockedAt}
                    onClick={() => setSelected({ achievement, level, unlockedAt })}
                  />
                ))}
              </div>

              {remaining > 0 && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                  className="w-full rounded-xl border border-border bg-transparent py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {t('achievements.showMore', { count: remaining })}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <AchievementDetailDialog
          open
          onOpenChange={(open) => { if (!open) setSelected(null); }}
          achievement={selected.achievement}
          level={selected.level}
          unlockedAt={selected.unlockedAt}
          language={language}
        />
      )}
    </>
  );
}
