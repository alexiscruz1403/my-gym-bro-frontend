import type {
  DayOfWeek,
  Exercise,
  LoadType,
  MuscleGroup,
  SessionSet,
  UserResponse,
} from '@/types/domain.types';

export interface ApiError {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface UpdateProfileRequest {
  username?: string;
}

// Exercises
export interface ExerciseListParams {
  search?: string;
  muscle?: MuscleGroup;
  loadType?: LoadType;
  page?: number;
  limit?: number;
}

export interface ExerciseListResponse {
  data: Exercise[];
  total: number;
  page: number;
  limit: number;
}

// Workout Plans
export interface CreatePlanExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  duration?: number;
  weight?: number;
  rest: number;
  notes?: string;
  supersetGroupId?: string;
}

export interface CreatePlanDay {
  dayOfWeek: DayOfWeek;
  exercises: CreatePlanExercise[];
}

export interface CreatePlanRequest {
  name: string;
  days: CreatePlanDay[];
}

export type UpdatePlanRequest = CreatePlanRequest;

// Sessions
export interface StartSessionRequest {
  dayOfWeek: DayOfWeek;
}

export interface LogSetRequest {
  exerciseId: string;
  setIndex: number;
  reps?: number;
  duration?: number;
  weight?: number;
  completed: boolean;
}

export interface LogSetResponse {
  exerciseId: string;
  sets: SessionSet[];
}

export interface ModifyExerciseRequest {
  plannedSets?: number;
  plannedReps?: number;
  plannedDuration?: number;
  plannedWeight?: number;
  plannedRest?: number;
}

export interface ReplaceExerciseRequest {
  newExerciseId: string;
  plannedSets?: number;
  plannedReps?: number;
  plannedDuration?: number;
  plannedWeight?: number;
  plannedRest?: number;
}

export interface FinishSessionRequest {
  status: 'completed' | 'partial';
}
