import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import useAuthStore from '@/store/auth.store';
import { usersService } from '@/services/users.service';
import type { UpdateProfileRequest, ApiError } from '@/types/api.types';
import type { UserResponse } from '@/types/domain.types';

export function useProfile() {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await usersService.getMe();
      setUser(userData);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message;
      const displayMessage = Array.isArray(message) ? message[0] : message;
      setError(displayMessage ?? 'Error al cargar el perfil.');
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const updateProfile = useCallback(
    async (data: UpdateProfileRequest): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedUser = await usersService.updateProfile(data);
        setUser(updatedUser);
        toast.success('Perfil actualizado correctamente.');
        return true;
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const message = error.response?.data?.message;
        const displayMessage = Array.isArray(message) ? message[0] : message;
        const errorMessage = displayMessage ?? 'Error al actualizar el perfil.';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser],
  );

  const uploadAvatar = useCallback(
    async (file: File): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedUser = await usersService.uploadAvatar(file);
        setUser(updatedUser);
        toast.success('Foto de perfil actualizada.');
        return true;
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const message = error.response?.data?.message;
        const displayMessage = Array.isArray(message) ? message[0] : message;
        const errorMessage = displayMessage ?? 'Error al subir la imagen.';
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [setUser],
  );

  // Auto-fetch when authenticated and user not yet loaded
  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, fetchProfile]);

  return {
    user: user as UserResponse | null,
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile,
  };
}
