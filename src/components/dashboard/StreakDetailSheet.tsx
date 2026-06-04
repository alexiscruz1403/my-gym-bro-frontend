'use client';

import { useTranslation } from 'react-i18next';
import { Trophy, CalendarDays, Zap, Flame } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const LEVEL_COLORS: Record<number, string> = {
  0: '#B4B4B4',
  1: '#4CE66C',
  2: '#33AEFF',
  3: '#A866FF',
  4: '#FFA633',
  5: '#FF5C5C',
};

interface StreakDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStreak: number;
  longestStreak: number;
  streakStartDate: string | null;
  streakLevel: 0 | 1 | 2 | 3 | 4 | 5;
  daysUntilNextLevel: number | null;
}

export function StreakDetailSheet({
  open,
  onOpenChange,
  currentStreak,
  longestStreak,
  streakStartDate,
  streakLevel,
  daysUntilNextLevel,
}: StreakDetailSheetProps) {
  const { t, i18n } = useTranslation();
  const color = LEVEL_COLORS[streakLevel] ?? LEVEL_COLORS[0];

  const formattedStartDate = streakStartDate
    ? new Intl.DateTimeFormat(i18n.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(streakStartDate))
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80dvh] overflow-y-auto rounded-t-2xl pb-8">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 shrink-0" style={{ color }} aria-hidden="true" />
            {t('dashboard.streakDetail.title')}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/40 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-[0.05em]">
                  {t('dashboard.streakDetail.startDate')}
                </span>
              </div>
              <p className="text-sm font-semibold leading-tight">
                {formattedStartDate ?? '—'}
              </p>
            </div>

            <div className="bg-muted/40 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Trophy className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-[0.05em]">
                  {t('dashboard.streakDetail.longestStreak')}
                </span>
              </div>
              <p
                className="font-display text-2xl font-bold leading-none tabular-nums"
                style={{ color }}
              >
                {longestStreak}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {t('dashboard.streakDays')}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-muted/40 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Zap className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-[0.05em]">
                {t('dashboard.streakDetail.nextLevel')}
              </span>
            </div>
            {daysUntilNextLevel === null ? (
              <span
                className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: `${color}22`, color }}
              >
                {t('dashboard.streakDetail.maxLevel')}
              </span>
            ) : (
              <p className="font-display text-2xl font-bold leading-none tabular-nums" style={{ color }}>
                {daysUntilNextLevel}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {t('dashboard.streakDetail.days')}
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              {t('dashboard.streakDetail.currentStreak')}
            </span>
            <p
              className="font-display text-xl font-bold tabular-nums"
              style={{ color }}
            >
              {currentStreak}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                {t('dashboard.streakDays')}
              </span>
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
