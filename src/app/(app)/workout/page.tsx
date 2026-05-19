'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { PlanList } from '@/components/workout/PlanList';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { usePlans } from '@/hooks/usePlans';
import { Plus, Dumbbell } from 'lucide-react';

const MAX_PLANS = 3;

export default function WorkoutPage() {
  const { t } = useTranslation();
  const { data: plans, loading, error, refetch } = usePlans();

  const notAIPlans = plans.filter(plan => !plan.isAiGenerated);
  const atLimit = notAIPlans.length >= MAX_PLANS;

  const newPlanAction = atLimit ? (
    <Button disabled size="sm" title={t('plans.maxReached')} className="h-[34px] cursor-not-allowed gap-1 px-3 text-[13px]">
      <Plus className="h-3.5 w-3.5" />
      {t('plans.newPlan')}
    </Button>
  ) : (
    <Button size="sm" render={<Link href="/workout/new" />} className="h-[34px] cursor-pointer gap-1 px-3 text-[13px]">
      <Plus className="h-3.5 w-3.5" />
      {t('plans.newPlan')}
    </Button>
  );

  return (
    <>
      <PageHeader title={t('plans.title')} action={newPlanAction} />

      <PageContainer>
        <Link
          href="/workout/exercises"
          className="text-muted-foreground hover:text-foreground mb-4 flex min-h-11 items-center gap-1.5 text-sm"
        >
          <Dumbbell className="h-4 w-4" />
          {t('plans.browseExercises')}
        </Link>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl" />
            ))}
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        {!loading && !error && <PlanList plans={plans} />}
      </PageContainer>
    </>
  );
}
