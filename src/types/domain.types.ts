export type UserRole = 'user' | 'admin';

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  followersCount: number;
  followingCount: number;
  role: UserRole;
  isActive: boolean;
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
  | 'calves'
  | 'adductors'
  | 'abductors';

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

export type TrackingType = 'reps' | 'duration';

export interface Exercise {
  id: string;
  name: string;
  musclesPrimary: MuscleGroup[];
  musclesSecondary: MuscleGroup[];
  loadType: LoadType;
  bilateral: boolean;
  trackingType: TrackingType;
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
  weightUnit?: 'kg' | 'lbs';
  rest: number;
  notes?: string;
  supersetGroupId?: string;
}

export interface PlanDay {
  dayOfWeek: DayOfWeek;
  dayName?: string | null;
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
  durationSeconds?: number;
  weightKg?: number;
  completed: boolean;
  loggedAt: string;
}

export interface SessionExercise {
  exerciseId: string;
  exerciseName: string;
  orderIndex: number;
  supersetGroupId?: string | null;
  weightUnit?: 'kg' | 'lbs';
  plannedSets: number;
  plannedReps?: number;
  plannedDuration?: number;
  plannedWeight?: number;
  plannedRest: number;
  trackingType: TrackingType;
  sets: SessionSet[];
  modifiedDuringSession: boolean;
  lastPerformance: SessionSet[] | null;
}

export interface WorkoutSession {
  _id: string;
  planId: string;
  planName: string;
  dayOfWeek: DayOfWeek;
  dayName?: string | null;
  status: SessionStatus;
  startedAt: string;
  finishedAt?: string;
  durationSeconds?: number;
  exercises: SessionExercise[];
}

// Session history

export interface SessionHistoryExercise {
  exerciseName: string;
  plannedSets: number;
  completedSets: number;
}

export interface SessionHistoryItem {
  _id: string;
  planName: string;
  dayOfWeek: DayOfWeek;
  dayName?: string | null;
  status: SessionStatus;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  totalSetsLogged: number;
  exercises: SessionHistoryExercise[];
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SessionHistoryResponse {
  data: SessionHistoryItem[];
  meta: PaginatedMeta;
}

// Stats — volume by period

export type StatsPeriod = 'week' | 'month' | 'year';

export interface VolumeBreakdownItem {
  label: string;
  volume: number;
  sets: number;
  sessions?: number;
}

export interface VolumeByPeriodResponse {
  period: StatsPeriod;
  date: string;
  from: string;
  to: string;
  totalVolume: number;
  totalSets: number;
  totalSessions: number;
  breakdown: VolumeBreakdownItem[];
}

// Stats — volume by muscle

export interface MuscleVolumeItem {
  rank: number;
  muscle: MuscleGroup;
  volume: number;
  sets: number;
}

export interface VolumeByMuscleResponse {
  period: StatsPeriod;
  date: string;
  from: string;
  to: string;
  ranking: MuscleVolumeItem[];
}

// Social

export interface PublicUserProfile {
  _id: string;
  username: string;
  avatar: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface PublicUserSummary {
  _id: string;
  username: string;
  avatar: string | null;
  isFollowing: boolean;
}

// Session summary snapshot — embedded in FeedPost at creation time

export interface SessionSummarySetSnapshot {
  reps?: number;
  durationSeconds?: number;
  weightKg?: number;
  completed: boolean;
}

export interface SessionSummaryExerciseSnapshot {
  name: string;
  sets: SessionSummarySetSnapshot[];
}

export interface SessionSummarySnapshot {
  durationSeconds: number;
  totalSets: number;
  volumeKg: number;
  exercises: SessionSummaryExerciseSnapshot[];
}

export interface FeedPost {
  _id: string;
  author: {
    _id: string;
    username: string;
    avatar: string | null;
  };
  sessionId: string;
  photoUrl: string | null;
  caption: string | null;
  reactionsCount: number;
  commentsCount: number;
  userReacted: boolean;
  sessionSummary: SessionSummarySnapshot | null;
  createdAt: string;
}

export interface FeedCommentReply {
  _id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface FeedComment {
  _id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
  replies: FeedCommentReply[];
}

// Exercise history

export interface ExerciseHistorySet {
  setIndex: number;
  reps?: number;
  weight?: number;
  duration?: number;
  completed: boolean;
  loggedAt: string;
}

export interface ExerciseHistorySession {
  sessionId: string;
  sessionDate: string;
  dayOfWeek: DayOfWeek;
  sets: ExerciseHistorySet[];
}

export interface ExerciseHistoryResponse {
  exerciseId: string;
  exerciseName: string;
  data: ExerciseHistorySession[];
  meta: PaginatedMeta;
}

// Public session history (C-08)

export interface PublicSessionHistoryExercise {
  exerciseName: string;
  sets: SessionSet[];
}

export interface PublicSessionHistoryItem {
  _id: string;
  planName: string;
  dayOfWeek: DayOfWeek;
  status: SessionStatus;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  totalSetsLogged: number;
  volumeKg: number;
  exercises: PublicSessionHistoryExercise[];
}

export interface PublicSessionHistoryResponse {
  data: PublicSessionHistoryItem[];
  meta: PaginatedMeta;
}

// Admin (C-11)

export interface AdminUserItem {
  _id: string;
  email: string;
  username: string;
  avatar: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface PaginatedAdminUserResponse {
  data: AdminUserItem[];
  meta: PaginatedMeta;
}
