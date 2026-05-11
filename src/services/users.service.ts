import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { PaginationParams, PaginatedUserSearchResponse, UpdateProfileRequest } from '@/types/api.types';
import type { Language, PublicUserProfile, UserResponse, PublicSessionHistoryResponse } from '@/types/domain.types';

export const usersService = {
  getMe: (): Promise<UserResponse> =>
    apiClient.get<UserResponse>(API_ROUTES.users.me).then((r) => r.data),

  updateProfile: (data: UpdateProfileRequest): Promise<UserResponse> =>
    apiClient
      .patch<UserResponse>(API_ROUTES.users.me, data)
      .then((r) => r.data),

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
      .get<PaginatedUserSearchResponse>(API_ROUTES.users.search, { params: { username, ...params } })
      .then((r) => r.data),

  getSessionHistory: (id: string, params?: PaginationParams): Promise<PublicSessionHistoryResponse> =>
    apiClient
      .get<PublicSessionHistoryResponse>(`/users/${id}/sessions`, { params })
      .then((r) => r.data),

  deleteAccount: (): Promise<void> =>
    apiClient.delete(API_ROUTES.users.deleteAccount).then(() => undefined),

  updateLanguage: (language: Language): Promise<UserResponse> =>
    apiClient.patch<UserResponse>(API_ROUTES.users.language, { language }).then((r) => r.data),
};
