'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Flag, MoreVertical, Timer, Trash2, Wrench, Flame } from 'lucide-react';
import useSessionStore from '@/store/session.store';
import { WarmupCalculatorSheet } from './WarmupCalculatorSheet';
import type { DayOfWeek, SessionExercise } from '@/types/domain.types';

function formatElapsed(startTime: number | null): string {
  const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface SessionHeaderProps {
  onFinish: () => void;
  onCancel: () => void;
  onToggleCountdown: () => void;
  countdownActive: boolean;
  activeExercise: SessionExercise | null;
}

export function SessionHeader({ onFinish, onCancel, onToggleCountdown, countdownActive, activeExercise }: SessionHeaderProps) {
  const { t } = useTranslation();
  const { sessionStartTime, activeSession } = useSessionStore();
  const [, tick] = useState(0);
  const [warmupOpen, setWarmupOpen] = useState(false);

  const dayLabels = t('days', { returnObjects: true }) as Record<DayOfWeek, string>;

  useEffect(() => {
    const id = setInterval(() => tick((v) => v + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-muted-foreground text-xs">{t('session.inProgress')}</p>
          <p className="font-display text-[17px] font-bold leading-tight">{activeSession?.planName ?? t('session.workout')}</p>
          {activeSession && (
            <p className="text-muted-foreground text-xs">
              {dayLabels[activeSession.dayOfWeek as DayOfWeek]}
              {activeSession.dayName && ` · ${activeSession.dayName}`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-display text-[24px] font-bold tabular-nums">
            {formatElapsed(sessionStartTime)}
          </span>

          {/* Tools dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  size="icon"
                  variant="ghost"
                  className={`min-h-11 min-w-9 cursor-pointer ${countdownActive ? 'bg-primary/10 text-primary hover:bg-primary/15' : ''}`}
                  aria-label={t('session.tools.ariaLabel')}
                />
              }
            >
              <Wrench className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end" className="bg-background w-max">
              <DropdownMenuItem onClick={onToggleCountdown} className="gap-3 px-4 py-3 text-base">
                <Timer className="h-5 w-5 shrink-0" />
                {t('session.tools.timer')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setWarmupOpen(true)}
                disabled={!activeExercise?.plannedWeight}
                className="gap-3 px-4 py-3 text-base"
              >
                <Flame className="h-5 w-5 shrink-0" />
                {t('session.tools.warmup')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop: explicit buttons */}
          <div className="hidden items-center gap-2 lg:flex">
            <Button
              size="sm"
              variant="outline"
              onClick={onCancel}
              className="min-h-11 cursor-pointer gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              {t('common.cancel')}
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={onFinish}
              className="min-h-11 cursor-pointer gap-1.5"
            >
              <Flag className="h-4 w-4" />
              {t('session.finish')}
            </Button>
          </div>

          {/* Mobile: dropdown menu */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    size="icon"
                    variant="ghost"
                    className="min-h-11 min-w-9 cursor-pointer"
                    aria-label={t('session.options.ariaLabel')}
                  />
                }
              >
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" className="bg-background w-max">
                <DropdownMenuItem onClick={onFinish} className="gap-3 px-4 py-3 text-base">
                  <Flag className="h-5 w-5 shrink-0" />
                  {t('session.finishMobile')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={onCancel} className="gap-3 px-4 py-3 text-base">
                  <Trash2 className="h-5 w-5 shrink-0" />
                  {t('session.cancelSession')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <WarmupCalculatorSheet
        open={warmupOpen}
        onOpenChange={setWarmupOpen}
        exercise={activeExercise}
      />
    </>
  );
}
