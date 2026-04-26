import type {
  DayOfWeek,
  Exercise,
  ExerciseSide,
  FeedComment,
  FeedPost,
  FollowRequestItem,
  LoadType,
  MuscleGroup,
  NotificationPreferences,
  PublicUserProfile,
  PublicUserSummary,
  SessionSet,
  StatsPeriod,
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
  isPrivate?: boolean;
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
  weightUnit?: 'kg' | 'lbs';
  rest: number;
  notes?: string;
  supersetGroupId?: string;
  left?: ExerciseSide;
  right?: ExerciseSide;
}

export interface CreatePlanDay {
  dayOfWeek: DayOfWeek;
  dayName?: string;
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
  left?: ExerciseSide;
  right?: ExerciseSide;
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
  weightUnit?: 'kg' | 'lbs';
  plannedLeft?: ExerciseSide;
  plannedRight?: ExerciseSide;
}

export interface ReplaceExerciseRequest {
  newExerciseId: string;
  plannedSets?: number;
  plannedReps?: number;
  plannedDuration?: number;
  plannedWeight?: number;
  plannedRest?: number;
  weightUnit?: 'kg' | 'lbs';
  plannedLeft?: ExerciseSide;
  plannedRight?: ExerciseSide;
}

export interface FinishSessionRequest {
  status: 'completed' | 'partial';
}

// History & Stats params

export interface SessionHistoryParams {
  page?: number;
  limit?: number;
}

export interface ExerciseHistoryParams {
  page?: number;
  limit?: number;
}

export interface StatsVolumeParams {
  period: StatsPeriod;
  date: string;
}

export interface StatsMuscleParams {
  period: StatsPeriod;
  date: string;
}

// Ranks params

export interface MuscleRanksParams {
  muscle?: string;
}

export interface LeaderboardParams extends PaginationParams {
  muscle?: MuscleGroup;
}

// Social & Feed

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export type FeedFilter = 'all' | 'mine';

export interface FeedQueryParams extends PaginationParams {
  // TODO: backend to implement — send as ?filter=mine to return only the requesting user's posts
  filter?: FeedFilter;
}

export interface PaginatedUserSearchResponse {
  data: PublicUserProfile[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedFollowListResponse {
  data: PublicUserSummary[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedFeedResponse {
  data: FeedPost[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedCommentsResponse {
  data: FeedComment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ReactionCountResponse {
  reactionsCount: number;
}

export interface CreatePostPayload {
  sessionId: string;
  caption?: string;
  file?: File;
}

// ─── Notifications ────────────────────────────────────────────────
import type { AppNotification } from '@/types/domain.types';

export interface ListNotificationsQuery {
  limit?: number;
  cursor?: string;
  unreadOnly?: boolean;
}

export interface ListNotificationsResponse {
  data: AppNotification[];
  nextCursor: string | null;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAllReadResponse {
  updated: number;
}

export interface WsTokenResponse {
  token: string;
}

export interface FollowActionResponse {
  pending: boolean;
}

export interface FollowRequestsResponse {
  data: FollowRequestItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UpdateNotificationPreferencesDto {
  allowFollow?: boolean;
  allowFollowRequest?: boolean;
  allowPostLike?: boolean;
  allowPostComment?: boolean;
  allowNewPost?: boolean;
}

export type { NotificationPreferences };
