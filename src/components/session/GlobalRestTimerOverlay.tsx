'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { useRestTimer } from '@/hooks/useRestTimer';
import { useDraggable } from '@/hooks/useDraggable';
import useSessionStore from '@/store/session.store';
import { playBeep } from '@/lib/audio';

function getDefaultPosition() {
  if (typeof window === 'undefined') return { x: 16, y: 120 };
  // Position near top so it's not covered by mobile nav or desktop taskbar
  return { x: 16, y: 80 };
}

export function GlobalRestTimerOverlay() {
  const restTimer = useSessionStore((s) => s.restTimer);
  const { secondsLeft, isRunning, stop, adjust } = useRestTimer();
  const [minimized, setMinimized] = useState(false);
  const { position, isDragging, pointerHandlers } = useDraggable({
    defaultPosition: getDefaultPosition(),
  });

  // Track whether the timer ended naturally (reached 0) vs was skipped.
  // We only beep when secondsLeft crosses from >0 to 0 AND restTimer is still
  // set (i.e. the interval brought it to 0, not the user pressing ×).
  const prevSecondsRef = useRef(secondsLeft);
  useEffect(() => {
    if (secondsLeft === 0 && prevSecondsRef.current > 0 && restTimer !== null) {
      playBeep();
    }
    prevSecondsRef.current = secondsLeft;
  }, [secondsLeft, restTimer]);

  if (!isRunning) return null;

  const total = restTimer?.durationSeconds ?? 1;
  const progress = Math.round(((total - secondsLeft) / total) * 100);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const baseStyle: React.CSSProperties = {
    position: 'fixed',
    top: position.y,
    left: position.x,
    cursor: isDragging ? 'grabbing' : undefined,
    touchAction: 'none',
    zIndex: 40,
    width: 'min(calc(100vw - 2rem), 20rem)',
  };

  const dragBorderClass = isDragging ? 'border-primary border-2' : 'border';

  if (minimized) {
    return (
      <div
        style={baseStyle}
        className={`flex items-center justify-between rounded-full ${dragBorderClass} bg-card px-4 py-2 shadow-lg`}
        {...pointerHandlers}
      >
        <span className="flex-1 font-display text-sm font-bold tabular-nums select-none">
          {display}
        </span>
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
    <div
      style={baseStyle}
      className={`rounded-xl ${dragBorderClass} bg-card p-4 shadow-lg`}
      {...pointerHandlers}
    >
      <div className="flex items-center justify-between" style={{ cursor: 'grab' }}>
        <p className="text-muted-foreground text-sm font-medium select-none">Rest</p>
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
      <p className="font-display mt-1 text-center text-4xl font-bold tabular-nums select-none">{display}</p>
      <Progress value={progress} className="mt-3 h-2" />
      <div className="mt-3 flex items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => adjust(-10)}
          className="cursor-pointer px-3 min-h-11"
          aria-label="Subtract 10 seconds"
        >
          -10s
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => adjust(10)}
          className="cursor-pointer px-3 min-h-11"
          aria-label="Add 10 seconds"
        >
          +10s
        </Button>
      </div>
      <p className="text-muted-foreground mt-2 text-center text-xs select-none">
        Mantén presionado para mover · × para saltar
      </p>
    </div>
  );
}
