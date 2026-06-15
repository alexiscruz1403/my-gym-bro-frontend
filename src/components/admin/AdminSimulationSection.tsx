'use client';

import { useTranslation } from 'react-i18next';
import { useAchievementAnimationStore } from '@/store/achievement-animation.store';
import { useStreakRewardAnimationStore } from '@/store/streak-reward-animation.store';
import type { AchievementUnlockedPayload, StreakRewardUnlockedPayload } from '@/types/domain.types';

const MOCK_ACHIEVEMENTS: Record<string, AchievementUnlockedPayload> = {
  bronze: {
    nameEs: 'Logro de prueba',
    nameEn: 'Test Achievement',
    descriptionEs: 'Simulación de logro bronce',
    descriptionEn: 'Bronze achievement simulation',
    tier: 'bronze',
    earnedCount: 128,
    badgeUrl: null,
  },
  silver: {
    nameEs: 'Logro de prueba',
    nameEn: 'Test Achievement',
    descriptionEs: 'Simulación de logro plata',
    descriptionEn: 'Silver achievement simulation',
    tier: 'silver',
    earnedCount: 47,
    badgeUrl: null,
  },
  gold: {
    nameEs: 'Logro de prueba',
    nameEn: 'Test Achievement',
    descriptionEs: 'Simulación de logro oro',
    descriptionEn: 'Gold achievement simulation',
    tier: 'gold',
    earnedCount: 12,
    badgeUrl: null,
  },
};

const MOCK_REWARDS: { label: string; payload: StreakRewardUnlockedPayload }[] = [
  { label: 'Premium 14d — inmediato (30d)', payload: { type: 'PREMIUM_DAYS', milestone: 30, days: 14, deferred: false } },
  { label: 'Premium 14d — diferido (30d)',  payload: { type: 'PREMIUM_DAYS', milestone: 30, days: 14, deferred: true } },
  { label: 'Premium 30d — diferido (181d)', payload: { type: 'PREMIUM_DAYS', milestone: 181, days: 30, deferred: true } },
  { label: 'Slot de planes (366d)',          payload: { type: 'PLAN_SLOT', milestone: 366 } },
  { label: 'Premium 90d — inmediato (731d)', payload: { type: 'PREMIUM_DAYS', milestone: 731, days: 90, deferred: false } },
  { label: 'Título Mr. Olimpia (1826d)',     payload: { type: 'EXCLUSIVE_TITLE', milestone: 1826, titleKey: 'mr_olimpia', titleNameEs: 'Mr. Olimpia', titleNameEn: 'Mr. Olympia' } },
  { label: 'Activación diferida (sin hito)', payload: { type: 'PREMIUM_DAYS', days: 30, deferred: false } },
];

export function AdminSimulationSection() {
  const { t } = useTranslation();
  const enqueueAchievement = useAchievementAnimationStore((s) => s.enqueue);
  const enqueueReward = useStreakRewardAnimationStore((s) => s.enqueue);

  return (
    <div className="space-y-4">
      {/* Achievements */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <p className="text-sm font-semibold">{t('admin.simulation.achievementsTitle')}</p>
        <div className="flex flex-wrap gap-2">
          {(['bronze', 'silver', 'gold'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => enqueueAchievement(MOCK_ACHIEVEMENTS[tier])}
              className="rounded-full border border-border bg-transparent px-3.5 py-1.5 text-[12px] font-semibold text-foreground transition-colors hover:bg-muted/60 cursor-pointer capitalize"
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Streak Rewards */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
        <p className="text-sm font-semibold">{t('admin.simulation.rewardsTitle')}</p>
        <div className="flex flex-wrap gap-2">
          {MOCK_REWARDS.map(({ label, payload }) => (
            <button
              key={label}
              type="button"
              onClick={() => enqueueReward(payload)}
              className="rounded-full border border-border bg-transparent px-3.5 py-1.5 text-[12px] font-semibold text-foreground transition-colors hover:bg-muted/60 cursor-pointer"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
