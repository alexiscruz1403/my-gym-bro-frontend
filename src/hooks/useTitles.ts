'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { getMyTitles, setActiveTitle } from '@/services/titles.service';
import useAuthStore from '@/store/auth.store';
import type { MyTitle, TitleInfo } from '@/types/domain.types';

export const TITLES_KEY = ['titles', 'my'] as const;

export function useTitles() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isLoading } = useQuery({
    queryKey: TITLES_KEY,
    queryFn: getMyTitles,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  return { titles: data ?? [], isLoading };
}

export function useSetActiveTitle() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  const { mutate, isPending } = useMutation({
    mutationFn: (titleKey: string | null) => setActiveTitle(titleKey),
    onSuccess: (_data, titleKey) => {
      // Read fresh user from store — avoids stale closure, same pattern as useSubscription
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        let newActiveTitle: TitleInfo | null;
        if (titleKey === null) {
          newActiveTitle = null;
        } else {
          const cached = queryClient.getQueryData<MyTitle[]>(TITLES_KEY) ?? [];
          const found = cached.find((t) => t.titleKey === titleKey);
          newActiveTitle = found
            ? { key: found.titleKey, nameEs: found.nameEs, nameEn: found.nameEn }
            : null;
        }
        setUser({ ...currentUser, activeTitle: newActiveTitle });
      }
      queryClient.invalidateQueries({ queryKey: TITLES_KEY });
    },
    onError: () => {
      toast.error(t('titles.setActiveError'));
    },
  });

  return { setActiveTitle: mutate, isSetting: isPending };
}
