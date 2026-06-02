export interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
  className?: string;
}

import type { ExerciseSide } from '@/types/domain.types';

export interface ExerciseConfigDraft {
  exerciseId: string;
  exerciseName: string;
  gifUrl?: string;
  sets: number;
  minReps?: number;
  maxReps?: number;
  duration?: number;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  rest: number;
  notes?: string;
  supersetGroupId?: string;
  bilateral?: boolean;
  left?: ExerciseSide;
  right?: ExerciseSide;
}

export interface RestTimerState {
  durationSeconds: number;
  startedAt: number;
  exerciseId: string;
}

export interface CountdownTimerState {
  durationSeconds: number;
  startedAt: number;
  pausedSecondsLeft: number | null; // null = running, number = paused
}
