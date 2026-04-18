'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playBeep } from '@/lib/audio';
import type { ExerciseSide, SessionSet } from '@/types/domain.types';
import type { SetCompletePayload } from './SetRow';

interface DurationSetRowProps {
  setIndex: number;
  bilateral: boolean;
  plannedDuration: number;
  plannedLeft?: ExerciseSide | null;
  plannedRight?: ExerciseSide | null;
  loggedSet?: SessionSet;
  onComplete: (setIndex: number, payload: SetCompletePayload & { duration?: number }) => void;
}

function useCountdown(target: number) {
  const [secondsLeft, setSecondsLeft] = useState(target);
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
          playBeep();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return clear;
  }, [running]);

  useEffect(() => {
    setSecondsLeft(target);
  }, [target]);

  const start = () => {
    setSecondsLeft(target);
    setRunning(true);
  };
  const retry = () => {
    clear();
    setRunning(false);
    setSecondsLeft(target);
  };
  const stopAndGet = (): number => {
    clear();
    setRunning(false);
    const elapsed = target - secondsLeft;
    return elapsed > 0 ? elapsed : target;
  };

  return { secondsLeft, running, start, retry, stopAndGet, target };
}

function formatClock(s: number) {
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function DurationSetRow({
  setIndex,
  bilateral,
  plannedDuration,
  plannedLeft,
  plannedRight,
  loggedSet,
  onComplete,
}: DurationSetRowProps) {
  const isCompleted = loggedSet?.completed ?? false;

  const main = useCountdown(plannedDuration);
  const leftTimer = useCountdown(plannedLeft?.duration ?? plannedDuration);
  const rightTimer = useCountdown(plannedRight?.duration ?? plannedDuration);

  const [leftElapsed, setLeftElapsed] = useState<number | null>(
    loggedSet?.left?.duration ?? null,
  );
  const [rightElapsed, setRightElapsed] = useState<number | null>(
    loggedSet?.right?.duration ?? null,
  );

  if (!bilateral) {
    const handleFinishLeft = () => {
      const elapsed = leftTimer.stopAndGet();
      setLeftElapsed(elapsed);
    };
    const handleFinishRight = () => {
      const elapsed = rightTimer.stopAndGet();
      setRightElapsed(elapsed);
    };

    const bothDone = leftElapsed !== null && rightElapsed !== null;

    const handleCompleteSet = () => {
      if (!bothDone) return;
      onComplete(setIndex, {
        left: { duration: leftElapsed ?? undefined, weight: plannedLeft?.weight },
        right: { duration: rightElapsed ?? undefined, weight: plannedRight?.weight },
      });
    };

    const renderSideTimer = (
      label: 'L' | 'R',
      timer: ReturnType<typeof useCountdown>,
      elapsed: number | null,
      onFinish: () => void,
    ) => (
      <div className="flex items-center gap-3">
        <span className="w-6 shrink-0 text-center text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <p className="font-display flex-1 text-center text-xl font-bold tabular-nums">
          {elapsed !== null
            ? `${elapsed}s`
            : formatClock(timer.secondsLeft)}
        </p>
        <div className="flex items-center gap-1.5">
          {elapsed === null && !timer.running && timer.secondsLeft === timer.target && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={timer.start}
              className="h-9 w-9 cursor-pointer"
              aria-label={`Start ${label} timer`}
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          {elapsed === null && (timer.running || (timer.secondsLeft < timer.target && timer.secondsLeft > 0)) && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={timer.retry}
              className="h-9 w-9 cursor-pointer"
              aria-label={`Retry ${label}`}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          {elapsed === null && (timer.secondsLeft === 0 || timer.running || timer.secondsLeft < timer.target) && (
            <Button
              type="button"
              size="icon"
              variant={timer.secondsLeft === 0 ? 'default' : 'outline'}
              onClick={onFinish}
              className="h-9 w-9 cursor-pointer"
              aria-label={`Finish ${label}`}
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );

    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-lg px-3 py-2 transition-colors',
          isCompleted ? 'bg-primary/10' : 'bg-muted/30',
        )}
      >
        <span
          className={cn(
            'w-8 shrink-0 pt-2 text-center text-sm font-medium',
            isCompleted ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {setIndex + 1}
        </span>
        <div className="flex flex-1 flex-col gap-2">
          {renderSideTimer('L', leftTimer, leftElapsed, handleFinishLeft)}
          {renderSideTimer('R', rightTimer, rightElapsed, handleFinishRight)}
        </div>
        {!isCompleted ? (
          <Button
            type="button"
            size="icon"
            variant={bothDone ? 'default' : 'outline'}
            onClick={handleCompleteSet}
            disabled={!bothDone}
            className="h-11 w-11 shrink-0 cursor-pointer"
            aria-label="Complete set"
          >
            <Check className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center">
            <Check className="text-primary h-5 w-5" />
          </div>
        )}
      </div>
    );
  }

  const handleFinishBilateral = () => {
    const elapsed = main.stopAndGet();
    onComplete(setIndex, { weight: undefined, reps: undefined, duration: elapsed });
  };

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
        {isCompleted
          ? loggedSet?.duration
            ? `${loggedSet.duration}s`
            : 'Done'
          : formatClock(main.secondsLeft)}
      </p>

      {!isCompleted && (
        <div className="flex items-center gap-2">
          {!main.running && main.secondsLeft === main.target && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={main.start}
              className="h-11 w-11 cursor-pointer"
              aria-label="Start timer"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}

          {(main.running || (main.secondsLeft < main.target && main.secondsLeft > 0)) && (
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={main.retry}
              className="h-11 w-11 cursor-pointer"
              aria-label="Retry"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}

          {(main.secondsLeft === 0 || main.running || main.secondsLeft < main.target) && (
            <Button
              type="button"
              size="icon"
              variant={main.secondsLeft === 0 ? 'default' : 'outline'}
              onClick={handleFinishBilateral}
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
