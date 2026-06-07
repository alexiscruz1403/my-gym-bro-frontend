import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type {
  FeedQueryParams,
  PaginatedFeedResponse,
  PaginatedCommentsResponse,
  PaginationParams,
  ReactionCountResponse,
  CreatePostPayload,
} from '@/types/api.types';
import type { FeedPost, FeedComment, FeedCommentReply, WorkoutPlan } from '@/types/domain.types';

export async function getFeed(params?: FeedQueryParams): Promise<PaginatedFeedResponse> {
  const { data } = await apiClient.get<PaginatedFeedResponse>(API_ROUTES.feed.list, { params });
  return data;
}

export async function getPost(postId: string): Promise<FeedPost> {
  const { data } = await apiClient.get<FeedPost>(API_ROUTES.feed.post(postId));
  return data;
}

export async function createPost(payload: CreatePostPayload): Promise<FeedPost> {
  const formData = new FormData();
  formData.append('sessionId', payload.sessionId);
  if (payload.caption) formData.append('caption', payload.caption);
  if (payload.file) formData.append('file', payload.file);

  const { data } = await apiClient.post<FeedPost>(API_ROUTES.feed.create, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function addReaction(postId: string): Promise<ReactionCountResponse> {
  const { data } = await apiClient.post<ReactionCountResponse>(API_ROUTES.feed.reactions(postId));
  return data;
}

export async function removeReaction(postId: string): Promise<ReactionCountResponse> {
  const { data } = await apiClient.delete<ReactionCountResponse>(
    API_ROUTES.feed.removeReaction(postId),
  );
  return data;
}

export async function addComment(postId: string, text: string): Promise<FeedComment> {
  const { data } = await apiClient.post<FeedComment>(API_ROUTES.feed.comments(postId), { text });
  return data;
}

export async function addReply(postId: string, commentId: string, text: string): Promise<FeedCommentReply> {
  const { data } = await apiClient.post<FeedCommentReply>(
    API_ROUTES.feed.addReply(postId, commentId),
    { text },
  );
  return data;
}

export interface SharePlanPayload {
  planId: string;
  shareType: 'complete' | 'partial';
  dayOfWeek?: string;
  audience: 'followers' | 'individual';
  recipientId?: string;
  caption?: string;
}

export async function sharePlan(payload: SharePlanPayload): Promise<FeedPost> {
  const { data } = await apiClient.post<FeedPost>(API_ROUTES.feed.sharePlan, payload);
  return data;
}

export interface CopySharedPlanPayload {
  targetPlanId?: string;
  newPlanName?: string;
}

export async function copySharedPlan(
  postId: string,
  payload: CopySharedPlanPayload,
): Promise<WorkoutPlan> {
  const { data } = await apiClient.post<WorkoutPlan>(
    API_ROUTES.feed.copySharedPlan(postId),
    payload,
  );
  return data;
}

export async function getComments(
  postId: string,
  params?: PaginationParams,
): Promise<PaginatedCommentsResponse> {
  const { data } = await apiClient.get<PaginatedCommentsResponse>(
    API_ROUTES.feed.comments(postId),
    { params },
  );
  return data;
}
