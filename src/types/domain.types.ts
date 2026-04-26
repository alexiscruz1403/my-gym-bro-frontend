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
  isPrivate: boolean;
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

export interface ExerciseSide {
  reps?: number;
  duration?: number;
  weight?: number;
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
  bilateral?: boolean;
  left?: ExerciseSide | null;
  right?: ExerciseSide | null;
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
  left?: ExerciseSide | null;
  right?: ExerciseSide | null;
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
  bilateral?: boolean;
  plannedLeft?: ExerciseSide | null;
  plannedRight?: ExerciseSide | null;
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
  hasLbsExercises: boolean;
  previousTotalVolume: number;
  changePercent: number | null;
}

// Stats — volume by muscle

export interface MuscleVolumeItem {
  rank: number;
  muscle: MuscleGroup;
  volume: number;
  sets: number;
  previousVolume: number;
  changePercent: number | null;
}

export interface VolumeByMuscleResponse {
  period: StatsPeriod;
  date: string;
  from: string;
  to: string;
  ranking: MuscleVolumeItem[];
  hasLbsExercises: boolean;
}

// Social

export interface PublicUserProfile {
  _id: string;
  username: string;
  avatar: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isPrivate: boolean;
  isRequestPending: boolean;
}

export interface PublicUserSummary {
  _id: string;
  username: string;
  avatar: string | null;
  isFollowing: boolean;
  isPrivate?: boolean;
  isRequestPending?: boolean;
}

export interface FollowRequestItem {
  _id: string;
  senderId: string;
  username: string;
  avatar: string | null;
  createdAt: string;
}

export interface NotificationPreferences {
  allowFollow: boolean;
  allowFollowRequest: boolean;
  allowPostLike: boolean;
  allowPostComment: boolean;
  allowNewPost: boolean;
}

// Session summary snapshot — embedded in FeedPost at creation time

export interface SessionSummarySetSnapshot {
  reps?: number;
  durationSeconds?: number;
  weightKg?: number;
  completed: boolean;
  left?: ExerciseSide | null;
  right?: ExerciseSide | null;
}

export interface SessionSummaryExerciseSnapshot {
  name: string;
  sets: SessionSummarySetSnapshot[];
  bilateral?: boolean;
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
  weightUnit?: 'kg' | 'lbs';
  duration?: number;
  completed: boolean;
  loggedAt: string;
  left?: ExerciseSide | null;
  right?: ExerciseSide | null;
}

export interface ExerciseHistorySession {
  sessionId: string;
  sessionDate: string;
  dayOfWeek: DayOfWeek;
  weightUnit: 'kg' | 'lbs';
  sets: ExerciseHistorySet[];
}

export interface ExerciseHistoryResponse {
  exerciseId: string;
  exerciseName: string;
  bilateral?: boolean;
  data: ExerciseHistorySession[];
  meta: PaginatedMeta;
}

// Public session history (C-08)

export interface PublicSessionHistoryExercise {
  exerciseName: string;
  sets: SessionSet[];
  bilateral?: boolean;
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

// Ranks

export type RankLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ExerciseRankItem {
  exerciseId: string;
  exerciseName: string;
  rank: RankLevel;
  rankName: string;
  bestValue: number;
  updatedAt: string;
}

export interface MuscleRankItem {
  muscle: MuscleGroup;
  rank: RankLevel;
  rankName: string;
  exercises: ExerciseRankItem[];
}

export interface LeaderboardUserEntry {
  userId: string;
  username: string;
  avatar: string | null;
  isSelf: boolean;
  muscleRanks: MuscleRankItem[];
}

export interface LeaderboardResponse {
  self: LeaderboardUserEntry;
  data: LeaderboardUserEntry[];
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

export type NotificationType =
  | 'follow'
  | 'follow_request'
  | 'follow_accepted'
  | 'post_like'
  | 'post_comment'
  | 'new_post'
  | 'system';

export interface NotificationDataFollow {
  actorUsername: string;
  actorAvatar: string | null;
}

export interface NotificationDataPostLike {
  actorUsername: string;
  actorAvatar: string | null;
  postId: string;
}

export interface NotificationDataPostComment {
  actorUsername: string;
  actorAvatar: string | null;
  postId: string;
  commentText: string;
}

export interface NotificationDataNewPost {
  actorUsername: string;
  actorAvatar: string | null;
  postId: string;
}

export interface NotificationDataSystem {
  title: string;
  body: string;
}

export interface NotificationDataFollowRequest {
  actorUsername: string;
  actorAvatar: string | null;
}

export interface NotificationDataFollowAccepted {
  actorUsername: string;
  actorAvatar: string | null;
}

export type NotificationData =
  | NotificationDataFollow
  | NotificationDataFollowRequest
  | NotificationDataFollowAccepted
  | NotificationDataPostLike
  | NotificationDataPostComment
  | NotificationDataNewPost
  | NotificationDataSystem;

export interface AppNotification {
  _id: string;
  recipientId: string;
  actorId: string | null;
  type: NotificationType;
  data: NotificationData;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
