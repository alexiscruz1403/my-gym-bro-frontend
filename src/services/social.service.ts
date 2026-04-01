import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { PaginationParams, PaginatedFollowListResponse } from '@/types/api.types';

export async function followUser(userId: string): Promise<void> {
  await apiClient.post(API_ROUTES.social.follow(userId));
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
