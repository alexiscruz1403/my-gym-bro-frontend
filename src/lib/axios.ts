import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api.types';
import { API_ROUTES } from '@/lib/api-routes';
import { getConfig } from '@/lib/runtime-config';
import { logout, setAuthenticated } from '@/store/auth.store';

export function isNetworkError(error: unknown): boolean {
  return !navigator.onLine || (axios.isAxiosError(error) && !(error as AxiosError).response);
}

export const apiClient = axios.create({
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  config.baseURL ??= getConfig().apiUrl;
  return config;
});

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

    if (!isUnauthorized || isRefreshEndpoint || isLoginEndpoint || alreadyRetried) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await apiClient.post(API_ROUTES.auth.refresh);

      setAuthenticated(true);
      processQueue(null);

      return apiClient(originalRequest);
    } catch (refreshError) {
      logout();
      processQueue(refreshError);
      if (typeof window !== 'undefined') {
        fetch(`${getConfig().apiUrl}${API_ROUTES.auth.logout}`, {
          method: 'POST',
          credentials: 'include',
        }).finally(() => {
          window.location.href = '/login';
        });
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
