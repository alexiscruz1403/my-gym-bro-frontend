'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SessionSet } from '@/types/domain.types';

interface DurationSetRowProps {
  setIndex: number;
  plannedDuration: number;
  loggedSet?: SessionSet;
  onComplete: (setIndex: number, weight: undefined, reps: undefined, duration: number) => void;
}

export function DurationSetRow({ setIndex, plannedDuration, loggedSet, onComplete }: DurationSetRowProps) {
  const isCompleted = loggedSet?.completed ?? false;
  const [secondsLeft, setSecondsLeft] = useState(plannedDuration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clear();
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return clear;
  }, [running]);

  const handleStart = () => {
    setSecondsLeft(plannedDuration);
    setRunning(true);
  };

  const handleRetry = () => {
    clear();
    setRunning(false);
    setSecondsLeft(plannedDuration);
  };

  const handleFinish = () => {
    clear();
    setRunning(false);
    const elapsed = plannedDuration - secondsLeft;
    onComplete(setIndex, undefined, undefined, elapsed > 0 ? elapsed : plannedDuration);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
        isCompleted ? 'bg-primary/10' : 'bg-muted/30',
      )}
    >
      <span
        className={cn(
          'w-8 shrink-0 text-center text-sm font-medium',
          isCompleted ? 'text-primary' : 'text-muted-foreground',
        )}
      >
        {setIndex + 1}
      </span>

      <p className="font-display flex-1 text-center text-2xl font-bold tabular-nums">
        {isCompleted ? (loggedSet?.duration ? `${loggedSet.duration}s` : 'Done') : display}
      </p>

      {!isCompleted && (
        <div className="flex items-center gap-2">
          {!running && secondsLeft === plannedDuration && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={handleStart}
              className="h-11 w-11 cursor-pointer"
              aria-label="Start timer"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}

          {(running || (secondsLeft < plannedDuration && secondsLeft > 0)) && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={handleRetry}
              className="h-11 w-11 cursor-pointer"
              aria-label="Retry"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}

          {(secondsLeft === 0 || running || secondsLeft < plannedDuration) && (
            <Button
              type="button"
              size="icon"
              variant={secondsLeft === 0 ? 'default' : 'outline'}
              onClick={handleFinish}
              className="h-11 w-11 cursor-pointer"
              aria-label="Finish set"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {isCompleted && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center">
          <Check className="text-primary h-5 w-5" />
        </div>
      )}
    </div>
  );
}
