export type UserRole = 'user' | 'admin';
export type Language = 'es' | 'en';

export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft';

export interface PhysicalData {
  weightValue?: number | null;
  weightUnit?: WeightUnit;
  heightValue?: number | null;
  heightUnit?: HeightUnit;
  bodyFatPercent?: number | null;
}

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
  membershipTier: MembershipTier;
  membershipStatus: MembershipStatus | null;
  autoRenew: boolean;
  language: Language;
  physicalData?: PhysicalData | null;
}

export interface BilingualString {
  es: string;
  en: string;
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

export type WeightInstruction =
  | 'barbell_sum'
  | 'machine_display'
  | 'machine_sum_sides'
  | 'bodyweight'
  | 'no_weight'
  | 'cable_display'
  | 'cable_sum_sides'
  | 'each_side_weight';

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
  weightGuide?: { instruction: WeightInstruction; note: string | null };
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
  repsMax?: number;
  duration?: number;
  gifUrl?: string;
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
  isAiGenerated?: boolean;
  days: PlanDay[];
  goals?: { mainGoal?: AiFitnessGoal | null; focusMuscles?: MuscleGroup[] } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlanListItem {
  id: string;
  name: string;
  isActive: boolean;
  isAiGenerated?: boolean;
  daysCount: number;
  configuredDays: string[];
  totalExercises: number;
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
  gifUrl?: string | null;
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
  weightUnit?: 'kg' | 'lbs';
  completed: boolean;
  left?: ExerciseSide | null;
  right?: ExerciseSide | null;
}

export interface SessionSummaryExerciseSnapshot {
  exerciseName: string;
  sets: SessionSummarySetSnapshot[];
  bilateral?: boolean;
  gifUrl?: string;
  exerciseId?: string;
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

export interface ExerciseRankSummaryItem {
  exerciseId: string;
  exerciseName: string;
  rankBefore: number | null;
  rankNameBefore: string | null;
  rankAfter: number;
  rankNameAfter: string;
  bestValueBefore: number | null;
  bestValueAfter: number;
  gifUrl?: string | null;
}

export interface FinishSessionResponse {
  session: WorkoutSession;
  rankSummary: ExerciseRankSummaryItem[];
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

// Feature 8 — Exercise detail tabs

export interface ExerciseVolumeResponse extends VolumeByPeriodResponse {
  exerciseId: string;
}

export interface ExerciseRankResponse {
  exerciseId: string;
  exerciseName: string | null;
  rank: RankLevel | null;
  rankName: string | null;
  bestValue: number | null;
  updatedAt: string | null;
}

// Membership / Subscription (Feature 9)

export type MembershipTier = 'free' | 'premium';

export type MembershipStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export type SubscriptionPlan = 'monthly' | 'annual';

export type SubscriptionStatus = 'authorized' | 'paused' | 'cancelled' | 'pending' | 'payment_failed';

export interface SubscriptionResponse {
  _id: string;
  userId: string;
  preapprovalId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amountArs: number;
  orderNumber: string;
  autoRenew: boolean;
  nextBillingDate?: string;
  lastPaymentDate?: string;
  cancelledAt?: string;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
}

// Admin (C-11 / Feature 12)

export interface AdminUserItem {
  _id: string;
  email: string;
  username: string;
  avatar: string | null;
  role: UserRole;
  isActive: boolean;
  membershipTier: MembershipTier;
  createdAt: string;
}

export interface GiftMembershipDto {
  plan: SubscriptionPlan;
}

export interface RevokeMembershipDto {
  reason: string;
}

export interface PaginatedAdminUserResponse {
  data: AdminUserItem[];
  meta: PaginatedMeta;
}

export interface PaymentLog {
  _id: string;
  userId: string;
  subscriptionId: string;
  preapprovalId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amountArs?: number;
  orderNumber?: string;
  nextBillingDate?: string;
  lastPaymentDate?: string;
  cancelledAt?: string;
  failureCount: number;
  error?: string;
  createdAt: string;
}

export interface PaginatedPaymentLogResponse {
  data: PaymentLog[];
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

export interface ExerciseSwapProposal {
  suggestedExercise: {
    id: string;
    name: string;
    musclesPrimary: MuscleGroup[];
    loadType: LoadType;
    bilateral: boolean;
    trackingType: TrackingType;
  };
  justification: string;
}

// AI Features (10 & 11)

export type AiFitnessGoal =
  | 'muscle_gain'
  | 'fat_loss'
  | 'body_recomposition'
  | 'strength'
  | 'endurance'
  | 'general_health'
  | 'mobility';

export type AiExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type AiEquipment =
  | 'no_equipment'
  | 'dumbbells'
  | 'bands'
  | 'barbell_plates'
  | 'full_gym';

export type AiPhysicalLimitation =
  | 'knee_injury'
  | 'lower_back_pain'
  | 'shoulder_sensitivity'
  | 'previous_surgery';

export type AiPreference =
  | 'heavy_lifting'
  | 'prefers_machines'
  | 'prefers_free_weights'
  | 'hates_cardio';

export type AiSex = 'male' | 'female';

export type ProgressionChangeType =
  | 'weight_increase'
  | 'weight_decrease'
  | 'weight_maintain'
  | 'sets_change'
  | 'reps_change'
  | 'deload';

export interface PhysicalProfile {
  age: number;
  sex: AiSex;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg?: number;
  estimatedBodyFatPercent?: number;
}

export interface GeneratePlanRequest {
  physicalProfile: PhysicalProfile;
  goal: AiFitnessGoal;
  experience: AiExperienceLevel;
  daysPerWeek: number;
  minutesPerSession: number;
  equipment: AiEquipment[];
  physicalLimitations?: AiPhysicalLimitation[];
  preferences?: AiPreference[];
  excludedExerciseIds?: string[];
  includedExerciseIds?: string[];
}

export interface AiPlanProfile {
  id: string;
  planId: string;
  physicalProfile: PhysicalProfile;
  goal: AiFitnessGoal;
  experience: AiExperienceLevel;
  daysPerWeek: number;
  minutesPerSession: number;
  equipment: AiEquipment[];
  physicalLimitations: AiPhysicalLimitation[];
  preferences: AiPreference[];
  templateUsed: string;
  createdAt: string;
}

export interface GeneratePlanResponse {
  plan: WorkoutPlan;
  profileId: string;
  templateUsed: string;
  message: string;
}

export interface ExerciseChange {
  exerciseId: string;
  exerciseName: string;
  changeType: ProgressionChangeType;
  previousWeight: number;
  newWeight: number;
  previousSets: number;
  newSets: number;
  previousReps: number;
  newReps: number;
  reasoning: string;
}

export type ProgressionLogStatus = 'pending' | 'applied' | 'rejected' | 'failed';

export interface ProgressionAnalysisResponse {
  logId: string;
  planId: string;
  isDeloadWeek: boolean;
  status: ProgressionLogStatus;
  changesApplied: ExerciseChange[];
  message: string;
}

export interface ConfirmProgressionRequest {
  logId: string;
  apply: boolean;
}

export interface SuggestChangeRequest {
  planId: string;
  exerciseId: string;
  newSets?: number;
  newReps?: number;
  newWeight?: number;
  userReasoning?: string;
}

export interface SuggestChangeResponse {
  approved: boolean;
  reasoning: string;
  appliedChange: ExerciseChange | null;
}

export interface StreakResponse {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export interface TermsSection {
  _id: string;
  header: string;
  content: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTermsSection {
  _id: string;
  header: BilingualString;
  content: BilingualString;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTermsSectionDto {
  header: BilingualString;
  content: BilingualString;
  order: number;
  isActive?: boolean;
}

export interface UpdateTermsSectionDto {
  header?: BilingualString;
  content?: BilingualString;
  order?: number;
  isActive?: boolean;
}

export type CreateAdminTermsSectionDto = CreateTermsSectionDto;
export type UpdateAdminTermsSectionDto = UpdateTermsSectionDto;

// Monitoring
export interface MonitoringUsersResponse {
  activeUsers: number;
  inactiveUsers: number;
  realTimeActiveUsers: number;
}

export interface SubscriptionActivationLog {
  id: string;
  userId: string;
  subscriptionId: string;
  activationType: 'manual' | 'auto_renewal';
  plan: 'monthly' | 'annual';
  amountPaid: number;
  actor: 'user' | 'system';
  createdAt: string;
}

export interface MonitoringSubscriptionsResponse {
  totalSubscriptions: number;
  stoppedRenewing: number;
  activeMonthly: number;
  activeAnnual: number;
  momChangePercent: number | null;
  recentActivations: SubscriptionActivationLog[];
}

export interface AiUsageLog {
  id: string;
  userId: string;
  actionType: 'plan_generation' | 'progression_analysis';
  actor: 'user' | 'system';
  createdAt: string;
}

export interface MonitoringAiResponse {
  planGenerationsThisMonth: number;
  progressionAnalysesThisMonth: number;
  momChangePercent: number | null;
  recentUsages: AiUsageLog[];
}

export interface ErrorLog {
  id: string;
  statusCode: number;
  message: string;
  endpoint: string;
  userId: string | null;
  createdAt: string;
}

export interface MonitoringErrorsResponse {
  data: ErrorLog[];
  meta: PaginatedMeta;
}
