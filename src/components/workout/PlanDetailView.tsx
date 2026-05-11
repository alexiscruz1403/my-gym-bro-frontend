'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanDayAccordion } from './PlanDayAccordion';
import { DeletePlanDialog } from './DeletePlanDialog';
import { ProgressionTab } from '@/components/ai/progression/ProgressionTab';
import { deletePlan, activatePlan } from '@/services/workout-plans.service';
import { invalidatePlanCache } from '@/hooks/usePlan';
import { usePlans } from '@/hooks/usePlans';
import { useCopyAiPlan } from '@/hooks/useCopyAiPlan';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Pencil, Zap, Sparkles, Copy, LayoutList, Loader2, AlertTriangle } from 'lucide-react';
import type { WorkoutPlan } from '@/types/domain.types';

interface PlanDetailViewProps {
  plan: WorkoutPlan;
  onUpdate: () => void;
}

export function PlanDetailView({ plan, onUpdate }: PlanDetailViewProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: plans } = usePlans();
  const [confirmingActivate, setConfirmingActivate] = useState(false);
  const [activating, setActivating] = useState(false);

  const isPremium =
    user?.membershipTier === 'premium' && user?.membershipStatus === 'active';
  const showProgressionTab = isPremium && plan.isActive;

  const normalPlanCount = plans.filter((p) => !p.isAiGenerated).length;
  const canCopy = normalPlanCount < 3;

  const { copy, isCopying } = useCopyAiPlan((newPlan) => {
    toast.success(t('plans.copiedAsNormal', { name: newPlan.name }));
  });

  const handleCopy = () => {
    copy(plan.id, {
      onError: (err: unknown) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 422) {
          toast.error(t('plans.error.maxPlans'));
        } else {
          toast.error(t('plans.copyError'));
        }
      },
    });
  };

  const handleActivate = async () => {
    setActivating(true);
    try {
      await activatePlan(plan.id);
      toast.success(t('plans.activated', { name: plan.name }));
      invalidatePlanCache(plan.id);
      onUpdate();
    } catch {
      toast.error(t('plans.activateError'));
    } finally {
      setActivating(false);
      setConfirmingActivate(false);
    }
  };

  const handleDelete = async () => {
    await deletePlan(plan.id);
    toast.success(t('plans.deleted', { name: plan.name }));
    invalidatePlanCache(plan.id);
    router.push('/workout');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="font-display text-2xl font-bold">{plan.name}</h1>
          {plan.isActive && (
            <Badge className="bg-green-500 text-white hover:bg-green-600">{t('plans.status.active')}</Badge>
          )}
          {plan.isAiGenerated && (
            <Badge variant="outline" className="border-primary/40 text-primary gap-1">
              <Sparkles className="h-3 w-3" />
              IA
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          {t('plans.dayCount', { count: plan.days.length })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {!plan.isActive && (
          confirmingActivate ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/5 px-3 py-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-orange-500" />
              <p className="text-xs text-orange-600 dark:text-orange-400">
                {t('plans.confirmActivate.warning')}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmingActivate(false)}
                disabled={activating}
                className="min-h-11 cursor-pointer px-3 text-xs"
              >
                {t('common.cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleActivate}
                disabled={activating}
                className="min-h-11 cursor-pointer px-3 text-xs"
              >
                {activating ? <Loader2 className="h-4 w-4 animate-spin" /> : t('plans.activate')}
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => setConfirmingActivate(true)} className="flex cursor-pointer items-center gap-1.5">
              <Zap className="h-4 w-4" />
              {t('plans.activate')}
            </Button>
          )
        )}
        {!plan.isAiGenerated && (
          <Button size="sm" variant="outline" render={<Link href={`/workout/${plan.id}/edit`} />} className="flex cursor-pointer items-center gap-1.5">
            <Pencil className="h-4 w-4" />
            {t('common.edit')}
          </Button>
        )}
        {plan.isAiGenerated && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={!canCopy || isCopying}
            title={!canCopy ? t('plans.maxNormalPlans') : undefined}
            className="flex cursor-pointer items-center gap-1.5"
          >
            {isCopying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {t('plans.copyAsNormal')}
          </Button>
        )}
        <DeletePlanDialog planName={plan.name} onConfirm={handleDelete} />
      </div>

      {showProgressionTab ? (
        <Tabs defaultValue="overview">
          <TabsList className="w-full bg-muted/60 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              <LayoutList className="h-3.5 w-3.5" />
              {t('plans.tabPlan')}
            </TabsTrigger>
            <TabsTrigger
              value="progression"
              className="flex-1 gap-1.5 rounded-lg data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t('plans.tabProgression')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            {plan.days.length > 0 ? (
              <PlanDayAccordion days={plan.days} />
            ) : (
              <p className="text-muted-foreground py-4 text-center text-sm">
                {t('plans.noExercises')}
              </p>
            )}
          </TabsContent>

          <TabsContent value="progression" className="mt-4">
            <ProgressionTab planId={plan.id} />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          {plan.days.length > 0 ? (
            <PlanDayAccordion days={plan.days} />
          ) : (
            <p className="text-muted-foreground py-4 text-center text-sm">
              {t('plans.noExercises')}
            </p>
          )}
        </>
      )}
    </div>
  );
}
