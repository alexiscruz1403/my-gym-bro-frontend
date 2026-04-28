import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import type { SubscriptionPlan, SubscriptionResponse } from '@/types/domain.types';

export interface CheckoutResponse {
  initPoint: string;
  preapprovalId: string;
}

export interface AutoRenewResponse {
  autoRenew: boolean;
}

export async function checkout(plan: SubscriptionPlan): Promise<CheckoutResponse> {
  const { data } = await apiClient.post<CheckoutResponse>(
    API_ROUTES.subscriptions.checkout,
    { plan },
  );
  return data;
}

export async function getMySubscription(): Promise<SubscriptionResponse | null> {
  try {
    const { data } = await apiClient.get<SubscriptionResponse>(API_ROUTES.subscriptions.me);
    return data;
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 404) return null;
    throw err;
  }
}

export async function toggleAutoRenew(autoRenew: boolean): Promise<AutoRenewResponse> {
  const { data } = await apiClient.patch<AutoRenewResponse>(
    API_ROUTES.subscriptions.autoRenew,
    { autoRenew },
  );
  return data;
}
