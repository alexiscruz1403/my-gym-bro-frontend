import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import useAuthStore from '@/store/auth.store';
import { queryClient } from '@/lib/query-client';
import { usersService } from '@/services/users.service';
import type { UpdateProfileRequest, ApiError } from '@/types/api.types';
import type { UserResponse } from '@/types/domain.types';

export function useProfile() {
  const { user, setUser, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache the profile fetch — syncs result into auth store as a side effect
  const { refetch: refetchQuery } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const userData = await usersService.getMe();
      setUser(userData);
      return userData;
    },
    enabled: isAuthenticated && !user,
    staleTime: 1000 * 60 * 5,
  });

  const fetchProfile = useCallback(async (): Promise<void> => {
    await refetchQuery();
  }, [refetchQuery]);

  const updateProfile = useCallback(
    async (data: UpdateProfileRequest): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedUser = await usersService.updateProfile(data);
        setUser(updatedUser);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        toast.success('Perfil actualizado correctamente.');
        return true;
      } catch (err) {
        const axiosError = err as AxiosError<ApiError>;
        const message = axiosError.response?.data?.message;
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
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        toast.success('Foto de perfil actualizada.');
        return true;
      } catch (err) {
        const axiosError = err as AxiosError<ApiError>;
        const message = axiosError.response?.data?.message;
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

  return {
    user: user as UserResponse | null,
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
    refetch: fetchProfile,
  };
}
