'use client';

import Image from 'next/image';
import { Medal, Calendar, Users, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Achievement, AchievementLevel, AchievementTier } from '@/types/domain.types';

interface AchievementDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement: Achievement;
  level: AchievementLevel;
  unlockedAt: string | null;
  language: 'es' | 'en';
}

const TIER_STYLES: Record<AchievementTier, { icon: string; bg: string }> = {
  bronze: { icon: 'text-amber-700', bg: 'bg-amber-100' },
  silver: { icon: 'text-slate-400', bg: 'bg-slate-100' },
  gold:   { icon: 'text-yellow-500', bg: 'bg-yellow-100' },
};

export function AchievementDetailDialog({
  open,
  onOpenChange,
  achievement,
  level,
  unlockedAt,
  language,
}: AchievementDetailDialogProps) {
  const { t } = useTranslation();

  const isLocked = !unlockedAt;
  const name = language === 'es' ? achievement.nameEs : achievement.nameEn;
  const description = language === 'es' ? level.descriptionEs : level.descriptionEn;
  const task = language === 'es' ? level.taskEs : level.taskEn;
  const tierLabel = language === 'es' ? level.labelEs : level.labelEn;
  const showTierLabel = achievement.levels.length > 1;
  const title = showTierLabel ? `${name} · ${tierLabel}` : name;

  const { icon, bg } = TIER_STYLES[level.tier];

  const formattedDate = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString(language === 'es' ? 'es-AR' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3 pb-1">
            {level.badgeUrl ? (
              <Image
                src={level.badgeUrl}
                alt={name}
                width={96}
                height={96}
                className={cn('h-24 w-24 object-contain', isLocked && 'grayscale opacity-40')}
              />
            ) : (
              <div
                className={cn(
                  'flex h-20 w-20 items-center justify-center rounded-full',
                  isLocked ? 'bg-muted' : bg,
                )}
              >
                <Medal className={cn('h-10 w-10', isLocked ? 'text-muted-foreground/30' : icon)} />
              </div>
            )}
            <DialogTitle className="text-center text-[15px]">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-center text-[13px]">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 rounded-xl bg-muted/50 px-4 py-3 text-[12px] text-muted-foreground">
          {formattedDate ? (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              <span>
                {t('achievements.earnedOn')} {formattedDate}
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <Lock className="mt-px h-3.5 w-3.5 shrink-0" />
              <span>
                <span className="font-medium text-foreground/70">{t('achievements.task')}:</span>{' '}
                {task}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0" />
            <span>{t('achievements.earnedCount', { count: level.earnedCount })}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
