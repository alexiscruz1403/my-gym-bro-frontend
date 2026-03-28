import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { UpdateProfileRequest } from '@/types/api.types';
import type { UserResponse } from '@/types/domain.types';

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
};
