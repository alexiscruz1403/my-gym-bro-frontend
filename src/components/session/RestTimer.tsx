'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import { useRestTimer } from '@/hooks/useRestTimer';
import useSessionStore from '@/store/session.store';

interface RestTimerProps {
  exerciseId: string;
}

export function RestTimer({ exerciseId }: RestTimerProps) {
  const restTimer = useSessionStore((s) => s.restTimer);
  const { secondsLeft, isRunning, stop, exerciseId: timerExerciseId } = useRestTimer();

  if (!isRunning || timerExerciseId !== exerciseId) return null;

  const total = restTimer?.durationSeconds ?? 1;
  const progress = Math.round(((total - secondsLeft) / total) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm font-medium">Rest</p>
        <Button
          size="icon"
          variant="ghost"
          onClick={stop}
          className="h-8 w-8 cursor-pointer"
          aria-label="Skip rest"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="font-display mt-1 text-center text-4xl font-bold tabular-nums">{display}</p>
      <Progress value={progress} className="mt-3 h-2" />
      <p className="text-muted-foreground mt-1 text-center text-xs">Tap × to skip</p>
    </div>
  );
}
