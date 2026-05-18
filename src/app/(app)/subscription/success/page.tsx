'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/PageContainer';
import { getMySubscription } from '@/services/subscription.service';
import { SUBSCRIPTION_KEY } from '@/hooks/useSubscription';

const MAX_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 3000;

export default function SubscriptionSuccessPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const attempts = useRef(0);
  const [timedOut, setTimedOut] = useState(false);

  const { data: subscription, isLoading } = useQuery({
    queryKey: SUBSCRIPTION_KEY,
    queryFn: getMySubscription,
    refetchInterval: (query) => {
      if (query.state.data?.status === 'authorized') return false;
      if (attempts.current >= MAX_ATTEMPTS) return false;
      attempts.current += 1;
      return POLL_INTERVAL_MS;
    },
    staleTime: 0,
  });

  const isAuthorized = subscription?.status === 'authorized';

  useEffect(() => {
    if (isAuthorized) {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    }
  }, [isAuthorized, queryClient]);

  useEffect(() => {
    if (!isAuthorized && attempts.current >= MAX_ATTEMPTS) {
      setTimedOut(true);
    }
  }, [isAuthorized]);

  const showLoading = isLoading || (!isAuthorized && !timedOut);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 py-12">
        {isAuthorized ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-amber-500" />
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-semibold">
                {t('subscription.success.title')}
              </h1>
              <p className="text-muted-foreground">{t('subscription.success.subtitle')}</p>
            </div>
            <Button
              onClick={() => router.push('/dashboard')}
              className="cursor-pointer bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              {t('subscription.success.cta')}
            </Button>
          </>
        ) : showLoading ? (
          <>
            <Loader2 className="h-16 w-16 text-muted-foreground animate-spin" />
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-semibold">
                {t('subscription.success.processing.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('subscription.success.processing.subtitle')}
              </p>
            </div>
          </>
        ) : (
          <>
            <Clock className="h-16 w-16 text-muted-foreground" />
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-semibold">
                {t('subscription.success.fallback.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('subscription.success.fallback.subtitle')}
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="cursor-pointer">
              {t('subscription.success.cta')}
            </Button>
          </>
        )}
      </div>
    </PageContainer>
  );
}
