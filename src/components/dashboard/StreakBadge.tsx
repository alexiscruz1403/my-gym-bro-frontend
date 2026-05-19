'use client';

import { useTranslation } from 'react-i18next';

type StreakLevel = 'off' | 'low' | 'medium' | 'high';

const FLAME_COLORS: Record<StreakLevel, string> = {
  off:    'oklch(68% .008 248)',
  low:    'oklch(74% .18 50)',
  medium: 'oklch(68% .20 35)',
  high:   'oklch(78% .17 80)',
};

function getLevel(streak: number): StreakLevel {
  if (streak === 0) return 'off';
  if (streak < 30) return 'low';
  if (streak < 180) return 'medium';
  return 'high';
}

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const { t } = useTranslation();
  const level = getLevel(streak);
  const color = FLAME_COLORS[level];

  return (
    <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 shadow-1">
      <span
        className="text-[22px] leading-none"
        style={{
          color,
          animation: level !== 'off' ? 'flame-badge 1.6s ease-in-out infinite' : undefined,
        }}
        aria-hidden="true"
      >
        🔥
      </span>
      <div>
        <div
          className="font-display text-[20px] font-bold leading-none tracking-tight tabular-nums"
          style={{ color }}
        >
          {streak}
        </div>
        <div className="text-[11px] font-medium text-muted-foreground">
          {t('dashboard.streakDays')}
        </div>
      </div>
    </div>
  );
}
