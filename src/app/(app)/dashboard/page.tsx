'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { ActivePlanCard } from '@/components/dashboard/ActivePlanCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useActivePlan } from '@/hooks/useActivePlan';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: activePlan, loading } = useActivePlan();

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

        <div className="space-y-2">
          <h2 className="text-sm font-medium">Active Plan</h2>
          {loading ? (
            <Skeleton className="h-44 w-full rounded-xl" />
          ) : activePlan ? (
            <ActivePlanCard plan={activePlan} />
          ) : (
            <QuickActionCard />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
