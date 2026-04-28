'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { checkout } from '@/services/subscription.service';
import type { SubscriptionPlan } from '@/types/domain.types';

interface PlanOption {
  plan: SubscriptionPlan;
  label: string;
  price: string;
  description: string;
}

const PLAN_OPTIONS: PlanOption[] = [
  {
    plan: 'monthly',
    label: 'Mensual',
    price: 'ARS 100 / mes',
    description: 'Acceso Premium mensual',
  },
  {
    plan: 'annual',
    label: 'Anual',
    price: 'ARS 1.000 / año',
    description: 'Ahorrá con el plan anual',
  },
];

export function PremiumCtaCard() {
  const [loadingPlan, setLoadingPlan] = useState<SubscriptionPlan | null>(null);

  async function handleSubscribe(plan: SubscriptionPlan) {
    if (loadingPlan) return;
    setLoadingPlan(plan);
    try {
      const { initPoint } = await checkout(plan);
      window.location.href = initPoint;
    } catch {
      toast.error('No se pudo iniciar el pago. Intentá de nuevo.');
      setLoadingPlan(null);
    }
  }

  return (
    <Card className="border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <CardTitle className="text-base">Pasate a Premium</CardTitle>
        </div>
        <CardDescription>Desbloqueá todas las funcionalidades de la app</CardDescription>
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
                'Suscribirse'
              )}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
