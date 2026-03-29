export interface UserResponse {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  followersCount: number;
  followingCount: number;
  createdAt: string;
}

export type MuscleGroup =
  | 'chest'
  | 'front_delts'
  | 'side_delts'
  | 'triceps'
  | 'lats'
  | 'upper_back'
  | 'rear_delts'
  | 'biceps'
  | 'forearms'
  | 'traps'
  | 'abs'
  | 'obliques'
  | 'lower_back'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves';

export type LoadType =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'bodyweight'
  | 'cable'
  | 'kettlebell'
  | 'resistance_band';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface Exercise {
  id: string;
  name: string;
  musclesPrimary: MuscleGroup[];
  musclesSecondary: MuscleGroup[];
  loadType: LoadType;
  bilateral: boolean;
  gifUrl?: string;
  videoUrl?: string;
}

export interface ExerciseConfig {
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

export interface PlanDay {
  dayOfWeek: DayOfWeek;
  exercises: ExerciseConfig[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  isActive: boolean;
  days: PlanDay[];
  createdAt: string;
  updatedAt: string;
}

export interface PlanListItem {
  id: string;
  name: string;
  isActive: boolean;
  daysCount: number;
}

export type SessionStatus = 'in_progress' | 'completed' | 'partial' | 'abandoned';

export interface SessionSet {
  setIndex: number;
  reps?: number;
  duration?: number;
  weight?: number;
  completed: boolean;
  loggedAt: string;
}

export interface SessionExercise {
  exerciseId: string;
  exerciseName: string;
  orderIndex: number;
  supersetGroupId?: string | null;
  plannedSets: number;
  plannedReps?: number;
  plannedDuration?: number;
  plannedWeight?: number;
  plannedRest: number;
  sets: SessionSet[];
  modifiedDuringSession: boolean;
  lastPerformance: SessionSet[] | null;
}

export interface WorkoutSession {
  _id: string;
  planId: string;
  planName: string;
  dayOfWeek: DayOfWeek;
  status: SessionStatus;
  startedAt: string;
  finishedAt?: string;
  durationSeconds?: number;
  exercises: SessionExercise[];
}

export interface SessionSummary {
  _id: string;
  status: SessionStatus;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  exercisesCompleted: number;
  totalSetsLogged: number;
}
