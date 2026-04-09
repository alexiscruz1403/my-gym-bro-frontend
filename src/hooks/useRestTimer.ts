'use client';

import { useEffect, useRef, useCallback } from 'react';
import useSessionStore from '@/store/session.store';
import { playBeep } from '@/lib/audio';

export function useRestTimer() {
  const { restTimer, setRestTimer } = useSessionStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Keep an interval running while timer is active so components re-render
  useEffect(() => {
    if (!restTimer) {
      clear();
      return;
    }
    clear();
    intervalRef.current = setInterval(() => {
      // Force a re-render by writing the same restTimer object back —
      // secondsLeft is computed from Date.now() so consumers always get fresh value
      useSessionStore.setState((s) => ({ restTimer: s.restTimer ? { ...s.restTimer } : null }));
    }, 500);

    return clear;
  }, [restTimer, clear]);

  const secondsLeft = restTimer
    ? Math.max(0, restTimer.durationSeconds - Math.floor((Date.now() - restTimer.startedAt) / 1000))
    : 0;

  const isRunning = restTimer !== null && secondsLeft > 0;

  // Play a beep once when the rest timer reaches zero
  const didBeepRef = useRef(false);
  useEffect(() => {
    if (restTimer && secondsLeft === 0 && !didBeepRef.current) {
      didBeepRef.current = true;
      playBeep();
    }
    if (!restTimer) {
      didBeepRef.current = false;
    }
  }, [restTimer, secondsLeft]);

  const start = useCallback(
    (durationSeconds: number, exerciseId: string) => {
      setRestTimer({ durationSeconds, startedAt: Date.now(), exerciseId });
    },
    [setRestTimer],
  );

  const stop = useCallback(() => {
    setRestTimer(null);
  }, [setRestTimer]);

  const reset = useCallback(() => {
    if (!restTimer) return;
    setRestTimer({ ...restTimer, startedAt: Date.now() });
  }, [restTimer, setRestTimer]);

  return { secondsLeft, isRunning, start, stop, reset, exerciseId: restTimer?.exerciseId ?? null };
}
