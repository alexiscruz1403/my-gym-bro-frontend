import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import useAuthStore from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';
import { unsubscribePush } from '@/services/notifications.service';
import type { LoginRequest, RegisterRequest, ApiError } from '@/types/api.types';

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setAuthenticated, setUser, logout: storeLogout } =
    useAuthStore();

  const register = useCallback(
    async (data: RegisterRequest): Promise<boolean> => {
      try {
        const response = await authService.register(data);
        setAuthenticated(true);
        setUser(response.user);
        router.push('/dashboard');
        return true;
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const message = error.response?.data?.message;
        const displayMessage = Array.isArray(message) ? message[0] : message;
        toast.error(displayMessage ?? 'Error al registrarse. Intenta de nuevo.');
        return false;
      }
    },
    [setAuthenticated, setUser, router],
  );

  const login = useCallback(
    async (data: LoginRequest): Promise<boolean> => {
      try {
        const response = await authService.login(data);
        setAuthenticated(true);
        setUser(response.user);
        router.push('/dashboard');
        return true;
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const message = error.response?.data?.message;
        const displayMessage = Array.isArray(message) ? message[0] : message;
        console.log("display", displayMessage)
        toast.error(displayMessage ?? 'Credenciales incorrectas.');
        return false;
      }
    },
    [setAuthenticated, setUser, router],
  );

  const logout = useCallback(async (): Promise<void> => {
    // Fire-and-forget push unsubscribe — does not block logout
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => reg.pushManager.getSubscription())
        .then((sub) => {
          if (!sub) return;
          return unsubscribePush(sub.endpoint)
            .then(() => sub.unsubscribe())
            .catch(() => {});
        })
        .catch(() => {});
    }

    try {
      await authService.logout();
    } catch {
      // Logout locally even if the API call fails
    } finally {
      storeLogout();
      router.push('/login');
    }
  }, [storeLogout, router]);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const userData = await usersService.getMe();
      setUser(userData);
    } catch {
      // If fetching user fails, the interceptor handles 401s
    }
  }, [setUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    fetchUser,
  };
}
