'use client';

import { useTranslation } from 'react-i18next';
import { PlanCard } from './PlanCard';
import { EmptyState } from '@/components/shared/EmptyState';
import type { PlanListItem } from '@/types/domain.types';

interface PlanListProps {
  plans: PlanListItem[];
}

export function PlanList({ plans }: PlanListProps) {
  const { t } = useTranslation();

  if (plans.length === 0) {
    return (
      <EmptyState
        title={t('plans.empty.title')}
        description={t('plans.empty.description')}
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
