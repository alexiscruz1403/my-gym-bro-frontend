import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@/types/api.types';

export const authService = {
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(API_ROUTES.auth.register, data).then((r) => r.data),

  login: (data: LoginRequest): Promise<AuthResponse> =>
    apiClient.post<AuthResponse>(API_ROUTES.auth.login, data).then((r) => r.data),

  // Refresh and logout are cookie-based — no tokens needed in the body
  refresh: (): Promise<void> =>
    apiClient.post<void>(API_ROUTES.auth.refresh).then((r) => r.data),

  logout: (): Promise<void> =>
    apiClient.post<void>(API_ROUTES.auth.logout).then((r) => r.data),
};
