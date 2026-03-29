export interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  action?: React.ReactNode;
  className?: string;
}

export interface ExerciseConfigDraft {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps?: number;
  duration?: number;
  weight?: number;
  rest: number;
  notes?: string;
  supersetGroupId?: string;
}

export interface RestTimerState {
  durationSeconds: number;
  startedAt: number;
  exerciseId: string;
}
