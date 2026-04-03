'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useRestTimer } from '@/hooks/useRestTimer';
import useSessionStore from '@/store/session.store';

export function GlobalRestTimerOverlay() {
  const restTimer = useSessionStore((s) => s.restTimer);
  const { secondsLeft, isRunning, stop } = useRestTimer();
  const [minimized, setMinimized] = useState(false);

  if (!isRunning) return null;

  const total = restTimer?.durationSeconds ?? 1;
  const progress = Math.round(((total - secondsLeft) / total) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (minimized) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-40 flex items-center justify-between rounded-full border bg-card px-4 py-2 shadow-lg lg:left-auto lg:right-6 lg:w-64">
        <span className="font-display text-sm font-bold tabular-nums">{display}</span>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setMinimized(false)}
          className="h-9 w-9 cursor-pointer"
          aria-label="Expand rest timer"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 rounded-xl border bg-card p-4 shadow-lg lg:left-auto lg:right-6 lg:w-64">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm font-medium">Rest</p>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMinimized(true)}
            className="h-11 w-11 cursor-pointer"
            aria-label="Minimize rest timer"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={stop}
            className="h-11 w-11 cursor-pointer"
            aria-label="Skip rest"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="font-display mt-1 text-center text-4xl font-bold tabular-nums">{display}</p>
      <Progress value={progress} className="mt-3 h-2" />
      <p className="text-muted-foreground mt-1 text-center text-xs">Tap × to skip</p>
    </div>
  );
}
