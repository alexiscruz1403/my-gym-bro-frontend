'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, CalendarDays, Zap, Flame, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const [guideOpen, setGuideOpen] = useState(false);
  const color = LEVEL_COLORS[streakLevel] ?? LEVEL_COLORS[0];

  const howItWorksItems = t('guides.streaks.howItWorksItems', { returnObjects: true }) as string[];
  const levels = t('guides.streaks.levels', { returnObjects: true }) as { level: string; range: string }[];

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

          {/* Collapsible guide */}
          <div className="rounded-xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setGuideOpen((v) => !v)}
              className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium text-muted-foreground">
                {t('guides.howItWorks')}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                  guideOpen && 'rotate-180',
                )}
              />
            </button>
            {guideOpen && (
              <div className="border-t border-border px-4 pb-4 pt-3 space-y-4">
                <div className="space-y-2">
                  {howItWorksItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-primary font-bold text-sm shrink-0 mt-px">•</span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
                    {t('guides.streaks.levelsTitle')}
                  </p>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="grid grid-cols-2 border-b border-border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground bg-muted/30">
                      <span>{t('guides.levelCol')}</span>
                      <span>{t('guides.rangeCol')}</span>
                    </div>
                    {levels.map((row) => (
                      <div key={row.level} className="grid grid-cols-2 px-3 py-2 border-b border-border last:border-0 text-sm">
                        <span className="font-semibold tabular-nums">{row.level}</span>
                        <span className="text-muted-foreground">{row.range}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
