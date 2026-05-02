'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { ActivePlanCard } from '@/components/dashboard/ActivePlanCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { PremiumCtaCard } from '@/components/dashboard/PremiumCtaCard';
import { PlanListSection } from '@/components/dashboard/PlanListSection';
import { StreakBadge } from '@/components/dashboard/StreakBadge';
import { InstallPwaBanner } from '@/components/dashboard/InstallPwaBanner';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useActivePlan } from '@/hooks/useActivePlan';
import { usePlans } from '@/hooks/usePlans';
import { useStreak } from '@/hooks/useStreak';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: activePlan, loading } = useActivePlan();
  const { data: plans, loading: plansLoading } = usePlans();
  const { currentStreak, loading: streakLoading } = useStreak();

  const isFree = !user?.membershipTier || user.membershipTier === 'free';

  const myPlans = plans.filter((p) => !p.isAiGenerated);
  const aiPlans = plans.filter((p) => p.isAiGenerated === true);

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">
            Hello, {user?.username ?? '…'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here&apos;s your training overview.
          </p>
        </div>

        <InstallPwaBanner />

        {isFree && <PremiumCtaCard />}

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium">Active Plan</h2>
            {!streakLoading && <StreakBadge streak={currentStreak} />}
          </div>
          {loading ? (
            <Skeleton className="h-44 w-full rounded-xl" />
          ) : activePlan ? (
            <ActivePlanCard plan={activePlan} />
          ) : (
            <QuickActionCard />
          )}
        </div>

        {!plansLoading && myPlans.length > 0 && (
          <div className="space-y-2">
            <PlanListSection title="My Plans" plans={myPlans} />
          </div>
        )}

        {!plansLoading && aiPlans.length > 0 && (
          <div className="space-y-2">
            <PlanListSection title="AI Plans" plans={aiPlans} />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
