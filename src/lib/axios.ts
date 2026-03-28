import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, RefreshResponse } from '@/types/api.types';
import { API_ROUTES } from '@/lib/api-routes';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  logout,
} from '@/store/auth.store';

// ─── Axios instance ───────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Refresh queue ────────────────────────────────────────────────
// Holds pending requests while a token refresh is in progress.
// All queued requests are resolved/rejected together once refresh completes.

type QueueItem = {
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, newToken: string | null): void {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(newToken as string);
    }
  });
  failedQueue = [];
}

// ─── Request interceptor — attach Authorization header ────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ─── Response interceptor — handle 401 + refresh ─────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isUnauthorized = error.response?.status === 401;
    const isRefreshEndpoint = originalRequest.url === API_ROUTES.auth.refresh;
    const alreadyRetried = originalRequest._retry;

    // Do not retry refresh requests or already-retried requests
    if (!isUnauthorized || isRefreshEndpoint || alreadyRetried) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue the request — it will be retried once refresh completes
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        logout();
        processQueue(new Error('No refresh token'), null);
        return Promise.reject(error);
      }

      const response = await apiClient.post<RefreshResponse>(
        API_ROUTES.auth.refresh,
        { refreshToken },
      );

      const { accessToken: newAccessToken } = response.data;

      setTokens({ accessToken: newAccessToken, refreshToken });
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);

      return apiClient(originalRequest);
    } catch (refreshError) {
      logout();
      processQueue(refreshError, null);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
