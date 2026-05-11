'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Target, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es as esLocale, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import type { AiPlanProfile, AiFitnessGoal } from '@/types/domain.types';

const GOAL_ICONS: Record<AiFitnessGoal, string> = {
  muscle_gain: '💪',
  fat_loss: '🔥',
  body_recomposition: '⚖️',
  strength: '🏋️',
  endurance: '🏃',
  general_health: '❤️',
  mobility: '🧘',
};

interface AiPlanProfileCardProps {
  profile: AiPlanProfile;
  index?: number;
}

export function AiPlanProfileCard({ profile, index = 0 }: AiPlanProfileCardProps) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'es' ? esLocale : enUS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <Link href={`/workout/${profile.planId}`} className="block">
        <div className="flex items-start gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.99]">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
            {GOAL_ICONS[profile.goal]}
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-sm truncate">
                {t(`ai.planCard.goal.${profile.goal}`)}
              </p>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </div>

            <p className="text-xs text-muted-foreground">{profile.templateUsed}</p>

            <div className="flex flex-wrap gap-1.5">
              {profile.equipment.slice(0, 3).map((eq) => (
                <Badge key={eq} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {t(`ai.planCard.equipment.${eq}`)}
                </Badge>
              ))}
              {profile.equipment.length > 3 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  +{profile.equipment.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {t('ai.planCard.daysPerWeek', { count: profile.daysPerWeek })}
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {profile.minutesPerSession} min
              </span>
              <span>
                {formatDistanceToNow(new Date(profile.createdAt), {
                  addSuffix: true,
                  locale: dateLocale,
                })}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function AiPlanProfileCardSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border bg-card p-4 animate-pulse">
      <div className="h-12 w-12 rounded-xl bg-muted flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="flex gap-1.5">
          <div className="h-4 w-16 rounded-full bg-muted" />
          <div className="h-4 w-16 rounded-full bg-muted" />
        </div>
        <div className="h-3 w-40 rounded bg-muted" />
      </div>
    </div>
  );
}

interface AiPlanCountBadgeProps {
  count: number;
  max?: number;
}

export function AiPlanCountBadge({ count, max = 3 }: AiPlanCountBadgeProps) {
  const { t } = useTranslation();
  const pct = (count / max) * 100;
  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs">
      <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
      <span className="text-muted-foreground">{t('ai.countBadge.label')}</span>
      <span className="font-semibold">{count} / {max}</span>
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
