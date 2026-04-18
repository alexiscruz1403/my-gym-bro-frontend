import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type {
  ListNotificationsQuery,
  ListNotificationsResponse,
  UnreadCountResponse,
  MarkAllReadResponse,
  WsTokenResponse,
} from '@/types/api.types';

export async function listNotifications(
  params?: ListNotificationsQuery,
): Promise<ListNotificationsResponse> {
  const { data } = await apiClient.get<ListNotificationsResponse>(
    API_ROUTES.notifications.list,
    { params },
  );
  return data;
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  const { data } = await apiClient.get<UnreadCountResponse>(
    API_ROUTES.notifications.unreadCount,
  );
  return data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(API_ROUTES.notifications.markRead(id));
}

export async function markAllNotificationsRead(): Promise<MarkAllReadResponse> {
  const { data } = await apiClient.patch<MarkAllReadResponse>(
    API_ROUTES.notifications.markAllRead,
  );
  return data;
}

export async function getWsToken(): Promise<WsTokenResponse> {
  const { data } = await apiClient.get<WsTokenResponse>(API_ROUTES.auth.wsToken);
  return data;
}
