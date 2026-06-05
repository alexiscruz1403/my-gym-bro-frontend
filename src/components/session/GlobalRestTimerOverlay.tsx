'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRestTimer } from '@/hooks/useRestTimer';
import { useDraggable } from '@/hooks/useDraggable';
import useSessionStore from '@/store/session.store';
import { playBeep } from '@/lib/audio';

const CIRCLE_SIZE = 112;
const STROKE = 6;
const R = (CIRCLE_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

function getDefaultPosition() {
  if (typeof window === 'undefined') return { x: 16, y: 120 };
  // Position near top so it's not covered by mobile nav or desktop taskbar
  return { x: 16, y: 80 };
}

export function GlobalRestTimerOverlay() {
  const { t } = useTranslation();
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

  const dragBorderClass = isDragging
    ? 'border-primary border-2'
    : 'border-2 border-black/20 dark:border-white/25';

  if (minimized) {
    return (
      <div
        style={baseStyle}
        className={`flex items-center justify-between rounded-full ${dragBorderClass} bg-card px-4 py-2 shadow-2`}
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
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const dashOffset = CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div
      style={baseStyle}
      className={`rounded-xl ${dragBorderClass} bg-card p-3 shadow-2`}
      {...pointerHandlers}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ cursor: 'grab' }}>
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground select-none">
          {t('session.rest.label')}
        </p>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setMinimized(true)}
          className="h-7 w-7 cursor-pointer"
          aria-label="Minimize rest timer"
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* SVG circle timer */}
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="relative flex items-center justify-center" style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
          <svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={R}
              fill="none"
              stroke="var(--muted)"
              strokeWidth={STROKE}
            />
            <circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={R}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <span className="absolute font-display text-[28px] font-bold tabular-nums select-none">
            {display}
          </span>
        </div>

        {/* Adjust + Skip buttons */}
        <div className="flex w-full items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => adjust(-10)}
            className="flex-1 cursor-pointer text-xs min-h-9"
            aria-label={t('session.rest.subtractAriaLabel')}
          >
            −10s
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={stop}
            className="flex-1 cursor-pointer text-xs min-h-9"
            aria-label={t('session.rest.skipAriaLabel')}
          >
            {t('session.rest.skip')}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => adjust(10)}
            className="flex-1 cursor-pointer text-xs min-h-9"
            aria-label={t('session.rest.addAriaLabel')}
          >
            +10s
          </Button>
        </div>
      </div>
    </div>
  );
}
