'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanDayAccordion } from './PlanDayAccordion';
import { DeletePlanDialog } from './DeletePlanDialog';
import { PlanGoalsSection } from './PlanGoalsSection';
import { ProgressionTab } from '@/components/ai/progression/ProgressionTab';
import { deletePlan, activatePlan } from '@/services/workout-plans.service';
import { invalidatePlanCache } from '@/hooks/usePlan';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  Pencil,
  Zap,
  Sparkles,
  LayoutList,
  Loader2,
  AlertTriangle,
  CalendarDays,
  Dumbbell,
} from 'lucide-react';
import type { WorkoutPlan } from '@/types/domain.types';

interface PlanDetailViewProps {
  plan: WorkoutPlan;
  onUpdate: () => void;
}

export function PlanDetailView({ plan, onUpdate }: PlanDetailViewProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [confirmingActivate, setConfirmingActivate] = useState(false);
  const [activating, setActivating] = useState(false);

  const isPremium =
    user?.membershipTier === 'premium' && user?.membershipStatus === 'active';
  const showProgressionTab = isPremium && plan.isActive;

  const [activeTab, setActiveTab] = useState<'overview' | 'progression'>('overview');

  const totalExercises = plan.days.reduce((sum, d) => sum + d.exercises.length, 0);

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
    <div className="space-y-5">
      {/* Hero */}
      <div className="space-y-2">
        <h1 className="font-display text-[26px] font-bold leading-[1.05] tracking-[0.01em]">
          {plan.name}
        </h1>

        {(plan.isActive || plan.isAiGenerated) && (
          <div className="flex flex-wrap gap-1.5">
            {plan.isActive && (
              <Badge className="h-auto rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent hover:bg-accent/15">
                ● {t('plans.status.active')}
              </Badge>
            )}
            {plan.isAiGenerated && (
              <Badge className="h-auto rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary hover:bg-primary/15">
                ✦ IA
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {t('plans.dayCount', { count: plan.days.length })}
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell className="h-3.5 w-3.5" />
            {t('plans.exerciseCount', { count: totalExercises })}
          </span>
        </div>
      </div>

      {/* Actions */}
      {!confirmingActivate ? (
        <div className="flex flex-wrap gap-2">
          {!plan.isActive && (
            <Button
              size="sm"
              onClick={() => setConfirmingActivate(true)}
              className="h-9 cursor-pointer gap-1.5 px-3.5 text-[13px] font-semibold"
            >
              <Zap className="h-3.5 w-3.5" />
              {t('plans.activate')}
            </Button>
          )}
          {!plan.isAiGenerated && (
            <Button
              size="sm"
              variant="outline"
              render={<Link href={`/workout/${plan.id}/edit`} />}
              className="h-9 cursor-pointer gap-1.5 px-3.5 text-[13px] font-semibold"
            >
              <Pencil className="h-3.5 w-3.5" />
              {t('common.edit')}
            </Button>
          )}
          <DeletePlanDialog planName={plan.name} onConfirm={handleDelete} />
        </div>
      ) : (
        <div className="rounded-2xl border border-primary/25 bg-primary/7 p-3.5">
          <div className="mb-2.5 flex items-start gap-1.5 text-[12px] leading-[1.5] text-primary">
            <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
            <span>{t('plans.confirmActivate.warning')}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmingActivate(false)}
              disabled={activating}
              className="h-9 flex-1 cursor-pointer text-[13px]"
            >
              {t('common.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleActivate}
              disabled={activating}
              className="h-9 flex-1 cursor-pointer text-[13px]"
            >
              {activating ? <Loader2 className="h-4 w-4 animate-spin" /> : t('plans.activate')}
            </Button>
          </div>
        </div>
      )}

      {/* Tabs (AI plans only) */}
      {showProgressionTab ? (
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'overview' | 'progression')}
        >
          <TabsList className="h-11! w-full rounded-xl bg-muted/60 p-1">
            <TabsTrigger
              value="overview"
              className="flex-1 gap-1.5 rounded-lg text-[13.5px] font-semibold transition-all data-active:bg-primary data-active:text-white dark:data-active:bg-primary dark:data-active:border-transparent dark:data-active:text-white"
            >
              <LayoutList className="h-3.5 w-3.5" />
              {t('plans.tabPlan')}
            </TabsTrigger>
            <TabsTrigger
              value="progression"
              className="flex-1 gap-1.5 rounded-lg text-[13.5px] font-semibold transition-all data-active:bg-primary data-active:text-white dark:data-active:bg-primary dark:data-active:border-transparent dark:data-active:text-white"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t('plans.tabProgression')}
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {activeTab === 'overview' ? (
                  plan.days.length > 0 ? (
                    <PlanDayAccordion
                      days={plan.days}
                      planId={plan.id}
                      showSwap={isPremium && !!plan.isAiGenerated}
                    />
                  ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      {t('plans.noExercises')}
                    </p>
                  )
                ) : (
                  <div className="space-y-5">
                    <ProgressionTab planId={plan.id} />
                    <PlanGoalsSection plan={plan} isPremium={isPremium} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      ) : (
        <>
          {plan.days.length > 0 ? (
            <PlanDayAccordion
              days={plan.days}
              planId={plan.id}
              showSwap={isPremium && !!plan.isAiGenerated}
            />
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {t('plans.noExercises')}
            </p>
          )}
        </>
      )}
    </div>
  );
}
