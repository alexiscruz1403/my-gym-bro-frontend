import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { MyTitle } from '@/types/domain.types';

export async function getMyTitles(): Promise<MyTitle[]> {
  const { data } = await apiClient.get<MyTitle[]>(API_ROUTES.titles.my);
  return data;
}

export async function setActiveTitle(titleKey: string | null): Promise<void> {
  await apiClient.patch(API_ROUTES.titles.setActive, { titleKey });
}
