'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flame } from 'lucide-react';
import { StreakDetailSheet } from './StreakDetailSheet';

const LEVEL_COLORS: Record<number, string> = {
  0: '#B4B4B4',
  1: '#4CE66C',
  2: '#33AEFF',
  3: '#A866FF',
  4: '#FFA633',
  5: '#FF5C5C',
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
        <Flame
          className="h-5.5 w-5.5 shrink-0"
          style={{
            color,
            animation: streakLevel > 0 ? 'flame-badge 1.6s ease-in-out infinite' : undefined,
          }}
          aria-hidden="true"
        />
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
