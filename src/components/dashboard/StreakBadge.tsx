'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StreakDetailSheet } from './StreakDetailSheet';

const LEVEL_COLORS: Record<number, string> = {
  0: 'oklch(68% .008 248)',
  1: 'oklch(74% .18 50)',
  2: 'oklch(71% .19 42)',
  3: 'oklch(68% .20 35)',
  4: 'oklch(64% .21 28)',
  5: 'oklch(78% .17 80)',
};

interface StreakBadgeProps {
  streak: number;
  longestStreak: number;
  streakStartDate: string | null;
  streakLevel: 0 | 1 | 2 | 3 | 4 | 5;
  daysUntilNextLevel: number | null;
}

export function StreakBadge({
  streak,
  longestStreak,
  streakStartDate,
  streakLevel,
  daysUntilNextLevel,
}: StreakBadgeProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const color = LEVEL_COLORS[streakLevel] ?? LEVEL_COLORS[0];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 shadow-1 cursor-pointer"
        aria-label="Ver detalle de racha"
      >
        <span
          className="text-[22px] leading-none"
          style={{
            color,
            animation: streakLevel > 0 ? 'flame-badge 1.6s ease-in-out infinite' : undefined,
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
      </button>

      <StreakDetailSheet
        open={open}
        onOpenChange={setOpen}
        currentStreak={streak}
        longestStreak={longestStreak}
        streakStartDate={streakStartDate}
        streakLevel={streakLevel}
        daysUntilNextLevel={daysUntilNextLevel}
      />
    </>
  );
}
