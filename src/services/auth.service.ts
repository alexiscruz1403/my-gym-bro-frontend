import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshResponse,
} from '@/types/api.types';

export const authService = {
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(API_ROUTES.auth.register, data).then((r) => r.data),

  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(API_ROUTES.auth.login, data).then((r) => r.data),

  refresh: (refreshToken: string): Promise<RefreshResponse> =>
    apiClient
      .post<RefreshResponse>(API_ROUTES.auth.refresh, { refreshToken })
      .then((r) => r.data),

  logout: (refreshToken: string): Promise<void> =>
    apiClient
      .post<void>(API_ROUTES.auth.logout, { refreshToken })
      .then((r) => r.data),
};
