'use client';

import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();

  const todayLabel = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  const { user } = useAuth();
  const { data: activePlan, loading } = useActivePlan();
  const { data: plans, loading: plansLoading } = usePlans();
  const { currentStreak, loading: streakLoading } = useStreak();

  const isFree = !user?.membershipTier || user.membershipTier === 'free';

  const myPlans = plans.filter((p) => !p.isAiGenerated);
  const aiPlans = plans.filter((p) => p.isAiGenerated === true);

  return (
    <PageContainer>
      <div className="space-y-5">
        {/* Greeting row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold leading-tight">
              {t('dashboard.greeting', { username: user?.username ?? '…' })}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{todayLabel}</p>
          </div>
          {!streakLoading && <StreakBadge streak={currentStreak} />}
        </div>

        <InstallPwaBanner />

        {isFree && <PremiumCtaCard />}

        {/* Active plan section */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
              {t('dashboard.activePlan')}
            </span>
          </div>
          {loading ? (
            <Skeleton className="h-55 w-full rounded-2xl" />
          ) : activePlan ? (
            <ActivePlanCard plan={activePlan} />
          ) : (
            <QuickActionCard isPremium={!isFree} />
          )}
        </div>

        {!plansLoading && myPlans.length > 0 && (
          <div>
            <PlanListSection title={t('dashboard.myPlans')} plans={myPlans} />
          </div>
        )}

        {!plansLoading && aiPlans.length > 0 && (
          <div>
            <PlanListSection title={t('dashboard.aiPlans')} plans={aiPlans} />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
