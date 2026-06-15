'use client';

import { Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface StreakBadgePillProps {
  currentStreak: number;
  className?: string;
}

export function StreakBadgePill({ currentStreak, className }: StreakBadgePillProps) {
  const { t } = useTranslation();

  return (
    <span className={cn(
      'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold',
      'border-orange-500/30 bg-orange-500/15 text-orange-600',
      className,
    )}>
      <Flame className="mr-0.5 inline h-3 w-3" />
      {currentStreak} {t('streakBadge.days')}
    </span>
  );
}
