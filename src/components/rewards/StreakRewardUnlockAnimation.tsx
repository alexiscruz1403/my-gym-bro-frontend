'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Crown, LayoutGrid, Award, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useStreakRewardAnimationStore } from '@/store/streak-reward-animation.store';
import useAuthStore from '@/store/auth.store';
import type { StreakRewardUnlockedPayload } from '@/types/domain.types';

const SPARKLE_POSITIONS = [
  { x: -52, y: -52 },
  { x:   0, y: -68 },
  { x:  52, y: -52 },
  { x: -68, y:   0 },
  { x:  68, y:   0 },
  { x: -52, y:  52 },
  { x:   0, y:  68 },
  { x:  52, y:  52 },
];

const TYPE_ICON = {
  PREMIUM_DAYS: Crown,
  PLAN_SLOT: LayoutGrid,
  EXCLUSIVE_TITLE: Award,
} as const;

interface RewardCardProps {
  item: StreakRewardUnlockedPayload;
  language: 'es' | 'en';
  onDismiss: () => void;
}

function RewardCard({ item, language, onDismiss }: RewardCardProps) {
  const { t } = useTranslation();
  const Icon = TYPE_ICON[item.type];

  const mainTitle = (() => {
    if (item.type === 'PREMIUM_DAYS') {
      if (!item.milestone && !item.deferred) return t('rewards.premiumDays.activated');
      return t('rewards.premiumDays.label', { days: item.days });
    }
    if (item.type === 'PLAN_SLOT') return t('rewards.planSlot');
    return t('rewards.exclusiveTitle');
  })();

  const subtitle = (() => {
    if (item.type === 'PREMIUM_DAYS' && item.deferred) return t('rewards.premiumDays.deferred');
    if (item.type === 'EXCLUSIVE_TITLE') {
      return language === 'es' ? (item.titleNameEs ?? '') : (item.titleNameEn ?? '');
    }
    return null;
  })();

  useEffect(() => {
    const id = setTimeout(onDismiss, 8000);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.25 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        onClick={onDismiss}
      />

      {/* Card */}
      <motion.div
        className="fixed left-1/2 top-1/2 z-[201] w-full max-w-[320px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-card shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)] ring-1 ring-foreground/10"
        initial={{ scale: 0.75, opacity: 0, y: 30 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          transition: { type: 'spring', damping: 22, stiffness: 220, delay: 0.05 },
        }}
        exit={{ scale: 0.92, opacity: 0, y: -16, transition: { duration: 0.2, ease: 'easeIn' } }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Orange top accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-rose-500" />

        <div className="px-6 pb-5 pt-6">
          {/* Badge area with sparkles */}
          <div className="relative mx-auto mb-5 flex h-30 w-30 items-center justify-center">
            {SPARKLE_POSITIONS.map((pos, i) => (
              <span
                key={i}
                className="absolute text-[10px] text-orange-500"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: pos.x,
                  marginTop: pos.y,
                  animation: `achievement-sparkle 1.4s ease-out ${i * 0.08}s both`,
                }}
              >
                ✦
              </span>
            ))}

            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ backgroundColor: 'rgba(249,115,22,0.45)' }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />

            <div className="relative flex h-22 w-22 items-center justify-center rounded-full bg-orange-100 ring-2 ring-orange-400/60">
              <Icon className="h-11 w-11 text-orange-500" />
            </div>
          </div>

          {/* Text content */}
          <div className="mb-5 space-y-1 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t('rewards.unlockTitle')}
            </p>
            {item.milestone && (
              <p className="text-[12px] font-semibold text-orange-500">
                ✦ {t('rewards.streakMilestone', { milestone: item.milestone })} ✦
              </p>
            )}
            <p className="font-display text-[22px] font-bold leading-tight tracking-tight text-foreground">
              {mainTitle}
            </p>
            {subtitle && (
              <p className={cn(
                'pt-1 text-[13px] leading-snug',
                item.type === 'EXCLUSIVE_TITLE' ? 'font-bold text-orange-500' : 'text-muted-foreground',
              )}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Progress bar + close */}
          <div className="flex items-center gap-3">
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-orange-500 origin-left"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 8, ease: 'linear' }}
                style={{ width: '100%' }}
              />
            </div>
            <button
              type="button"
              onClick={onDismiss}
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
              aria-label="Cerrar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function StreakRewardUnlockAnimation() {
  const [mounted, setMounted] = useState(false);
  const { queue, dequeue } = useStreakRewardAnimationStore();
  const user = useAuthStore((s) => s.user);
  const language = user?.language ?? 'es';

  useEffect(() => { setMounted(true); }, []);

  const current = queue[0] ?? null;

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {current && (
        <RewardCard
          key={`${current.type}-${current.milestone ?? 'deferred'}`}
          item={current}
          language={language}
          onDismiss={dequeue}
        />
      )}
    </AnimatePresence>
  );
}
