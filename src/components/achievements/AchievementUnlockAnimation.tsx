'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Medal, X, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useAchievementAnimationStore } from '@/store/achievement-animation.store';
import useAuthStore from '@/store/auth.store';
import type { AchievementTier, AchievementUnlockedPayload } from '@/types/domain.types';

// ─── Tier config ────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<
  AchievementTier,
  { bg: string; icon: string; glowColor: string; label: { es: string; en: string }; ring: string }
> = {
  bronze: {
    bg: 'bg-amber-100',
    icon: 'text-amber-700',
    glowColor: 'rgba(180,83,9,0.45)',
    ring: 'ring-amber-400/60',
    label: { es: 'Bronce', en: 'Bronze' },
  },
  silver: {
    bg: 'bg-slate-100',
    icon: 'text-slate-400',
    glowColor: 'rgba(148,163,184,0.5)',
    ring: 'ring-slate-400/60',
    label: { es: 'Plata', en: 'Silver' },
  },
  gold: {
    bg: 'bg-yellow-100',
    icon: 'text-yellow-500',
    glowColor: 'rgba(234,179,8,0.55)',
    ring: 'ring-yellow-400/60',
    label: { es: 'Oro', en: 'Gold' },
  },
};

// Sparkle positions around the badge circle (offsets in px from center)
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

// ─── Inner card (remounts on each new achievement via key prop) ──────────────

interface AchievementCardProps {
  item: AchievementUnlockedPayload;
  language: 'es' | 'en';
  onDismiss: () => void;
}

function AchievementCard({ item, language, onDismiss }: AchievementCardProps) {
  const { t } = useTranslation();
  const config = TIER_CONFIG[item.tier];
  const name = language === 'es' ? item.nameEs : item.nameEn;
  const description = language === 'es' ? item.descriptionEs : item.descriptionEn;
  const tierLabel = config.label[language];

  // Auto-dismiss after 5s; useEffect runs once on mount (resets per remount via key)
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
        {/* Tier-colored top accent strip */}
        <div className={cn('h-1.5 w-full', {
          'bg-gradient-to-r from-amber-400 to-amber-600': item.tier === 'bronze',
          'bg-gradient-to-r from-slate-300 to-slate-500': item.tier === 'silver',
          'bg-gradient-to-r from-yellow-300 to-yellow-500': item.tier === 'gold',
        })} />

        <div className="px-6 pb-5 pt-6">
          {/* Badge area with sparkles */}
          <div className="relative mx-auto mb-5 flex h-30 w-30 items-center justify-center">
            {/* Sparkle particles */}
            {SPARKLE_POSITIONS.map((pos, i) => (
              <span
                key={i}
                className={cn('absolute text-[10px]', config.icon)}
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

            {/* Diffuse glow behind badge — works for any badge shape */}
            <motion.div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ backgroundColor: config.glowColor }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />

            {/* Badge */}
            {item.badgeUrl ? (
              <Image
                src={item.badgeUrl}
                alt={name}
                width={120}
                height={120}
                className="relative h-30 w-30 object-contain drop-shadow-lg"
              />
            ) : (
              <div className={cn('relative flex h-22 w-22 items-center justify-center rounded-full', config.bg)}>
                <Medal className={cn('h-11 w-11', config.icon)} />
              </div>
            )}
          </div>

          {/* Text content */}
          <div className="mb-5 space-y-1 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              {t('achievements.unlockedTitle')}
            </p>
            <p className="font-display text-[22px] font-bold leading-tight tracking-tight text-foreground">
              {name}
            </p>
            <p className={cn('text-[13px] font-semibold', config.icon)}>
              ✦ {tierLabel} ✦
            </p>
            <p className="pt-1 text-[13px] leading-snug text-muted-foreground">
              {description}
            </p>
            <div className="flex items-center justify-center gap-1.5 pt-2 text-[11px] text-muted-foreground/70">
              <Users className="h-3 w-3" />
              <span>{t('achievements.earnedBy', { count: item.earnedCount })}</span>
            </div>
          </div>

          {/* Progress bar + close */}
          <div className="flex items-center gap-3">
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className={cn('absolute inset-y-0 left-0 rounded-full origin-left', {
                  'bg-amber-500': item.tier === 'bronze',
                  'bg-slate-400': item.tier === 'silver',
                  'bg-yellow-500': item.tier === 'gold',
                })}
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

// ─── Public component ────────────────────────────────────────────────────────

export function AchievementUnlockAnimation() {
  const [mounted, setMounted] = useState(false);
  const { queue, dequeue } = useAchievementAnimationStore();
  const user = useAuthStore((s) => s.user);
  const language = user?.language ?? 'es';

  useEffect(() => { setMounted(true); }, []);

  const current = queue[0] ?? null;

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {current && (
        <AchievementCard
          key={`${current.nameEs}-${current.tier}`}
          item={current}
          language={language}
          onDismiss={dequeue}
        />
      )}
    </AnimatePresence>
  );
}
