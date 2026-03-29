import { PlanCard } from './PlanCard';
import { EmptyState } from '@/components/shared/EmptyState';
import type { PlanListItem } from '@/types/domain.types';

interface PlanListProps {
  plans: PlanListItem[];
}

export function PlanList({ plans }: PlanListProps) {
  if (plans.length === 0) {
    return (
      <EmptyState
        title="No plans yet"
        description="Create your first workout plan to get started."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
