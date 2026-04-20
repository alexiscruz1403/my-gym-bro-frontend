'use client';

import { useEffect, useRef, useCallback } from 'react';
import useSessionStore from '@/store/session.store';
import { playBeep } from '@/lib/audio';

export function useCountdownTimer() {
  const { countdownTimer, setCountdownTimer, pauseCountdown, resumeCountdown } = useSessionStore();

  // Keep an interval running while timer is active so components re-render
  useEffect(() => {
    if (!countdownTimer || countdownTimer.pausedSecondsLeft !== null) return;

    const interval = setInterval(() => {
      useSessionStore.setState((s) => ({
        countdownTimer: s.countdownTimer ? { ...s.countdownTimer } : null,
      }));
    }, 500);

    return () => clearInterval(interval);
  }, [countdownTimer]);

  const secondsLeft = (() => {
    if (!countdownTimer) return 0;
    if (countdownTimer.pausedSecondsLeft !== null) return countdownTimer.pausedSecondsLeft;
    return Math.max(
      0,
      countdownTimer.durationSeconds - Math.floor((Date.now() - countdownTimer.startedAt) / 1000),
    );
  })();

  const isRunning = countdownTimer !== null && countdownTimer.pausedSecondsLeft === null && secondsLeft > 0;
  const isPaused = countdownTimer !== null && countdownTimer.pausedSecondsLeft !== null;

  // Beep when timer crosses zero, then reset to the original duration (paused)
  // so the user can quickly reuse the same timer.
  const prevSecondsRef = useRef(secondsLeft);
  useEffect(() => {
    if (secondsLeft === 0 && prevSecondsRef.current > 0 && countdownTimer !== null) {
      playBeep();
      // Reset to original duration in paused state
      setCountdownTimer({
        durationSeconds: countdownTimer.durationSeconds,
        startedAt: Date.now(),
        pausedSecondsLeft: countdownTimer.durationSeconds,
      });
    }
    prevSecondsRef.current = secondsLeft;
  }, [secondsLeft, countdownTimer, setCountdownTimer]);

  const start = useCallback(
    (durationSeconds: number) => {
      setCountdownTimer({ durationSeconds, startedAt: Date.now(), pausedSecondsLeft: null });
    },
    [setCountdownTimer],
  );

  const pause = useCallback(() => {
    if (!countdownTimer || countdownTimer.pausedSecondsLeft !== null) return;
    pauseCountdown(secondsLeft);
  }, [countdownTimer, pauseCountdown, secondsLeft]);

  const resume = useCallback(() => {
    if (!countdownTimer || countdownTimer.pausedSecondsLeft === null) return;
    resumeCountdown(countdownTimer.pausedSecondsLeft);
  }, [countdownTimer, resumeCountdown]);

  const reset = useCallback(() => {
    if (!countdownTimer) return;
    setCountdownTimer({
      durationSeconds: countdownTimer.durationSeconds,
      startedAt: Date.now(),
      pausedSecondsLeft: null,
    });
  }, [countdownTimer, setCountdownTimer]);

  const complete = useCallback(() => {
    setCountdownTimer(null);
  }, [setCountdownTimer]);

  return {
    secondsLeft,
    isRunning,
    isPaused,
    isActive: countdownTimer !== null,
    totalSeconds: countdownTimer?.durationSeconds ?? 0,
    start,
    pause,
    resume,
    reset,
    complete,
  };
}
