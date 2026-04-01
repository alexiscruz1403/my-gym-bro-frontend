'use client';

import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { PlanList } from '@/components/workout/PlanList';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { usePlans } from '@/hooks/usePlans';
import { Plus, Dumbbell } from 'lucide-react';

const MAX_PLANS = 3;

export default function WorkoutPage() {
  const { data: plans, loading, error, refetch } = usePlans();

  const atLimit = plans.length >= MAX_PLANS;

  return (
    <PageContainer>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">My Plans</h1>
        {atLimit ? (
          <Button disabled size="sm" title="Maximum 3 plans reached" className="flex min-h-11 items-center gap-1">
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        ) : (
          <Button size="sm" render={<Link href="/workout/new" />} className="flex min-h-11 items-center gap-1">
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        )}
      </div>

      <Link
        href="/workout/exercises"
        className="text-muted-foreground hover:text-foreground mb-4 flex min-h-11 items-center gap-1.5 text-sm"
      >
        <Dumbbell className="h-4 w-4" />
        Browse exercise catalog
      </Link>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && <PlanList plans={plans} />}
    </PageContainer>
  );
}
