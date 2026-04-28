'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMySubscription, toggleAutoRenew } from '@/services/subscription.service';
import useAuthStore from '@/store/auth.store';
import type { SubscriptionResponse } from '@/types/domain.types';

export const SUBSCRIPTION_KEY = ['subscription', 'me'] as const;

export function useSubscription() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: SUBSCRIPTION_KEY,
    queryFn: getMySubscription,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });

  const { mutate: updateAutoRenew, isPending: isToggling } = useMutation({
    mutationFn: (autoRenew: boolean) => toggleAutoRenew(autoRenew),

    onMutate: async (autoRenew) => {
      await queryClient.cancelQueries({ queryKey: SUBSCRIPTION_KEY });

      const previousSubscription =
        queryClient.getQueryData<SubscriptionResponse | null>(SUBSCRIPTION_KEY);
      const previousUser = user;

      queryClient.setQueryData<SubscriptionResponse | null>(
        SUBSCRIPTION_KEY,
        (old) => (old ? { ...old, autoRenew } : old),
      );

      if (user) {
        setUser({ ...user, autoRenew });
      }

      return { previousSubscription, previousUser };
    },

    onError: (_err, _autoRenew, ctx) => {
      if (ctx?.previousSubscription !== undefined) {
        queryClient.setQueryData(SUBSCRIPTION_KEY, ctx.previousSubscription);
      }
      if (ctx?.previousUser) {
        setUser(ctx.previousUser);
      }
      toast.error('No se pudo actualizar la renovación automática.');
    },

    onSuccess: (data) => {
      if (user) {
        setUser({ ...user, autoRenew: data.autoRenew });
      }
    },
  });

  return { subscription, isLoading, updateAutoRenew, isToggling };
}
