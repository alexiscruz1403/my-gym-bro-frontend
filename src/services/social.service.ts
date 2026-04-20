import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type {
  PaginationParams,
  PaginatedFollowListResponse,
  FollowActionResponse,
  FollowRequestsResponse,
} from '@/types/api.types';

export async function followUser(userId: string): Promise<FollowActionResponse> {
  const { data } = await apiClient.post<FollowActionResponse>(API_ROUTES.social.follow(userId));
  return data;
}

export async function unfollowUser(userId: string): Promise<void> {
  await apiClient.delete(API_ROUTES.social.unfollow(userId));
}

export async function getFollowers(
  userId: string,
  params?: PaginationParams,
): Promise<PaginatedFollowListResponse> {
  const { data } = await apiClient.get<PaginatedFollowListResponse>(
    API_ROUTES.social.followers(userId),
    { params },
  );
  return data;
}

export async function getFollowing(
  userId: string,
  params?: PaginationParams,
): Promise<PaginatedFollowListResponse> {
  const { data } = await apiClient.get<PaginatedFollowListResponse>(
    API_ROUTES.social.following(userId),
    { params },
  );
  return data;
}

export async function getPendingFollowRequests(page = 1): Promise<FollowRequestsResponse> {
  const { data } = await apiClient.get<FollowRequestsResponse>(
    API_ROUTES.social.followRequests.pending,
    { params: { page } },
  );
  return data;
}

export async function approveFollowRequest(userId: string): Promise<void> {
  await apiClient.post(API_ROUTES.social.followRequests.approve(userId));
}

export async function rejectFollowRequest(userId: string): Promise<void> {
  await apiClient.delete(API_ROUTES.social.followRequests.reject(userId));
}

export async function cancelFollowRequest(userId: string): Promise<void> {
  await apiClient.delete(API_ROUTES.social.followRequests.cancel(userId));
}
