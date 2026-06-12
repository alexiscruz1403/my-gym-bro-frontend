'use client';

import Image from 'next/image';
import { Medal, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AchievementLevel, AchievementTier } from '@/types/domain.types';

interface AchievementBadgeProps {
  level: AchievementLevel;
  name: string;
  isLocked: boolean;
  onClick: () => void;
}

const TIER_STYLES: Record<AchievementTier, { icon: string; bg: string }> = {
  bronze: { icon: 'text-amber-700', bg: 'bg-amber-100' },
  silver: { icon: 'text-slate-400', bg: 'bg-slate-100' },
  gold:   { icon: 'text-yellow-500', bg: 'bg-yellow-100' },
};

export function AchievementBadge({ level, name, isLocked, onClick }: AchievementBadgeProps) {
  const { icon, bg } = TIER_STYLES[level.tier];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 text-center focus:outline-none"
    >
      <div className="relative">
        {level.badgeUrl ? (
          <Image
            src={level.badgeUrl}
            alt={name}
            width={56}
            height={56}
            className={cn('h-14 w-14 object-contain', isLocked && 'grayscale opacity-40')}
          />
        ) : (
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full',
              isLocked ? 'bg-muted' : bg,
            )}
          >
            <Medal className={cn('h-7 w-7', isLocked ? 'text-muted-foreground/30' : icon)} />
          </div>
        )}

        {isLocked && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background ring-1 ring-border">
            <Lock className="h-2.5 w-2.5 text-muted-foreground" />
          </div>
        )}
      </div>

      <span
        className={cn(
          'line-clamp-2 text-[11px] font-medium leading-tight',
          isLocked ? 'text-muted-foreground/50' : 'text-foreground/80',
        )}
      >
        {name}
      </span>
    </button>
  );
}
