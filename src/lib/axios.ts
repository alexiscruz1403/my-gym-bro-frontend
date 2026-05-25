import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api.types';
import { API_ROUTES } from '@/lib/api-routes';
import { logout, setAuthenticated } from '@/store/auth.store';

export function isNetworkError(error: unknown): boolean {
  return !navigator.onLine || (axios.isAxiosError(error) && !(error as AxiosError).response);
}

// ─── Axios instance ───────────────────────────────────────────────
// withCredentials: true ensures httpOnly cookies are sent on every request.
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Refresh queue ────────────────────────────────────────────────
// Holds pending requests while a token refresh is in progress.
// All queued requests are resolved/rejected together once refresh completes.

type QueueItem = {
  resolve: () => void;
  reject: (reason: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown): void {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve();
    }
  });
  failedQueue = [];
}

// ─── Response interceptor — handle 401 + refresh ─────────────────
// The access token is stored in an httpOnly cookie — the browser sends it
// automatically. On 401, we attempt a silent refresh (also cookie-based).
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isUnauthorized = error.response?.status === 401;
    const isRefreshEndpoint = originalRequest.url?.includes(API_ROUTES.auth.refresh) ?? false;
    const isLoginEndpoint = originalRequest.url?.includes(API_ROUTES.auth.login) ?? false;
    const alreadyRetried = originalRequest._retry;

    // Do not retry refresh requests, login requests, or already-retried requests
    if (!isUnauthorized || isRefreshEndpoint || isLoginEndpoint || alreadyRetried) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue the request — it will be retried once refresh completes
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Refresh token is sent automatically via httpOnly cookie
      await apiClient.post(API_ROUTES.auth.refresh);

      setAuthenticated(true);
      processQueue(null);

      return apiClient(originalRequest);
    } catch (refreshError) {
      logout();
      processQueue(refreshError);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
