'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotificationPreferences, updateNotificationPreferences } from '@/services/settings.service';
import useAuthStore from '@/store/auth.store';
import type { NotificationPreferences, UpdateNotificationPreferencesDto } from '@/types/api.types';

export const NOTIFICATION_PREFS_KEY = ['notification-preferences'] as const;

export function useNotificationPreferences() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: NOTIFICATION_PREFS_KEY,
    queryFn: getNotificationPreferences,
    enabled: isAuthenticated,
  });

  const { mutate: updatePreferences } = useMutation({
    mutationFn: (dto: UpdateNotificationPreferencesDto) => updateNotificationPreferences(dto),
    onMutate: async (dto) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_PREFS_KEY });
      const previous = queryClient.getQueryData<NotificationPreferences>(NOTIFICATION_PREFS_KEY);
      queryClient.setQueryData<NotificationPreferences>(NOTIFICATION_PREFS_KEY, (old) =>
        old ? { ...old, ...dto } : old,
      );
      return { previous };
    },
    onError: (_err, _dto, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(NOTIFICATION_PREFS_KEY, ctx.previous);
      }
    },
  });

  return { preferences, isLoading, updatePreferences };
}
