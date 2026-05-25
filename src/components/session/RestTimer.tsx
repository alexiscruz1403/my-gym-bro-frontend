'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import { useRestTimer } from '@/hooks/useRestTimer';
import useSessionStore from '@/store/session.store';

interface RestTimerProps {
  exerciseId: string;
}

export function RestTimer({ exerciseId }: RestTimerProps) {
  const { t } = useTranslation();
  const restTimer = useSessionStore((s) => s.restTimer);
  const { secondsLeft, isRunning, stop, adjust, exerciseId: timerExerciseId } = useRestTimer();

  if (!isRunning || timerExerciseId !== exerciseId) return null;

  const total = restTimer?.durationSeconds ?? 1;
  const progress = Math.round(((total - secondsLeft) / total) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-1">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm font-medium">{t('session.rest.label')}</p>
        <Button
          size="icon"
          variant="ghost"
          onClick={stop}
          className="h-11 w-11 cursor-pointer"
          aria-label={t('session.rest.skipAriaLabel')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="font-display mt-1 text-center text-4xl font-bold tabular-nums">{display}</p>
      <Progress value={progress} className="mt-3 h-2" />
      <div className="mt-3 flex items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => adjust(-10)}
          className="cursor-pointer px-3 min-h-11"
          aria-label={t('session.rest.subtractAriaLabel')}
        >
          -10s
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => adjust(10)}
          className="cursor-pointer px-3 min-h-11"
          aria-label={t('session.rest.addAriaLabel')}
        >
          +10s
        </Button>
      </div>
      <p className="text-muted-foreground mt-2 text-center text-xs">{t('session.rest.skipInstruction')}</p>
    </div>
  );
}
