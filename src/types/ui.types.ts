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
  sets: number;
  reps?: number;
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
