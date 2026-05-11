'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { checkout } from '@/services/subscription.service';
import type { SubscriptionPlan } from '@/types/domain.types';

const PLAN_PRICES: Record<SubscriptionPlan, string> = {
  monthly: 'ARS 100 / mes',
  annual: 'ARS 1.000 / año',
};

export function PremiumCtaCard() {
  const { t } = useTranslation();
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null);

  const PLAN_OPTIONS: { plan: SubscriptionPlan; label: string; price: string; description: string }[] = [
    {
      plan: 'monthly',
      label: t('subscription.monthly'),
      price: PLAN_PRICES.monthly,
      description: t('subscription.monthlyDescription'),
    },
    {
      plan: 'annual',
      label: t('subscription.annual'),
      price: PLAN_PRICES.annual,
      description: t('subscription.annualDescription'),
    },
  ];

  async function handleSubscribe(plan: SubscriptionPlan) {
    if (loadingPlan) return;
    setLoadingPlan(plan);
    try {
      const { initPoint } = await checkout(plan);
      window.location.href = initPoint;
    } catch {
      toast.error(t('subscription.error'));
      setLoadingPlan(null);
    }
  }

  return (
    <Card className="border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <CardTitle className="text-base">{t('dashboard.premiumCta.title')}</CardTitle>
        </div>
        <CardDescription>{t('dashboard.premiumCta.subtitle')}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {PLAN_OPTIONS.map(({ plan, label, price, description }) => (
          <div
            key={plan}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">{price}</p>
            </div>
            <Button
              size="sm"
              disabled={loadingPlan !== null}
              onClick={() => handleSubscribe(plan)}
              className="shrink-0 cursor-pointer bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500"
            >
              {loadingPlan === plan ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                t('subscription.subscribe')
              )}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
