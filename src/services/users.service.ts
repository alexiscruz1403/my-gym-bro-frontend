import axios from 'axios';
import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { db } from '@/lib/db';
import { enqueue } from '@/lib/offline-queue';
import type { PaginationParams, PaginatedUserSearchResponse, UpdateProfileRequest } from '@/types/api.types';
import type { PhysicalData, Language, PublicUserProfile, UserResponse, PublicSessionHistoryResponse } from '@/types/domain.types';

function isNetworkError(error: unknown): boolean {
  return !navigator.onLine || (axios.isAxiosError(error) && !error.response);
}

export const usersService = {
  getMe: async (): Promise<UserResponse> => {
    try {
      const user = await apiClient.get<UserResponse>(API_ROUTES.users.me).then((r) => r.data);
      await db.userProfile.put(user);
      return user;
    } catch (error) {
      if (isNetworkError(error)) {
        const cached = await db.userProfile.toCollection().first();
        if (cached) return cached;
      }
      throw error;
    }
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
    if (!navigator.onLine) {
      const cached = await db.userProfile.toCollection().first();
      if (!cached) throw new Error('No cached profile');
      const updated = { ...cached, ...data, updatedAt: new Date().toISOString() };
      await db.userProfile.put(updated as UserResponse);
      await enqueue({
        type: 'UPDATE_PROFILE',
        method: 'PATCH',
        url: API_ROUTES.users.me,
        payload: data,
      });
      return updated as UserResponse;
    }
    const user = await apiClient
      .patch<UserResponse>(API_ROUTES.users.me, data)
      .then((r) => r.data);
    await db.userProfile.put(user);
    return user;
  },

  uploadAvatar: (file: File): Promise<UserResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<UserResponse>(API_ROUTES.users.avatar, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  getPublicProfile: (id: string): Promise<PublicUserProfile> =>
    apiClient.get<PublicUserProfile>(API_ROUTES.users.publicProfile(id)).then((r) => r.data),

  searchUsers: (username: string, params?: PaginationParams): Promise<PaginatedUserSearchResponse> =>
    apiClient
      .get<PaginatedUserSearchResponse>(API_ROUTES.users.search, {
        params: { username, ...params },
      })
      .then((r) => r.data),

  getSessionHistory: (id: string, params?: PaginationParams): Promise<PublicSessionHistoryResponse> =>
    apiClient
      .get<PublicSessionHistoryResponse>(`/users/${id}/sessions`, { params })
      .then((r) => r.data),

  deleteAccount: (): Promise<void> =>
    apiClient.delete(API_ROUTES.users.deleteAccount).then(() => undefined),

  updateLanguage: (language: Language): Promise<UserResponse> =>
    apiClient.patch<UserResponse>(API_ROUTES.users.language, { language }).then((r) => r.data),

  updatePhysicalData: async (data: PhysicalData): Promise<UserResponse> => {
    if (!navigator.onLine) {
      const cached = await db.userProfile.toCollection().first();
      if (!cached) throw new Error('No cached profile');
      const updated = {
        ...cached,
        physicalData: { ...cached.physicalData, ...data },
      } as UserResponse;
      await db.userProfile.put(updated);
      await enqueue({
        type: 'UPDATE_PHYSICAL_DATA',
        method: 'PATCH',
        url: API_ROUTES.users.physicalData,
        payload: data,
      });
      return updated;
    }
    const user = await apiClient
      .patch<UserResponse>(API_ROUTES.users.physicalData, data)
      .then((r) => r.data);
    await db.userProfile.put(user);
    return user;
  },
};
