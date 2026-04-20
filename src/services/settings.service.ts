import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { NotificationPreferences, UpdateNotificationPreferencesDto } from '@/types/api.types';

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const { data } = await apiClient.get<NotificationPreferences>(API_ROUTES.notifications.preferences);
  return data;
}

export async function updateNotificationPreferences(
  dto: UpdateNotificationPreferencesDto,
): Promise<NotificationPreferences> {
  const { data } = await apiClient.patch<NotificationPreferences>(
    API_ROUTES.notifications.preferences,
    dto,
  );
  return data;
}
