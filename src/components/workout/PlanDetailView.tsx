'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlanDayAccordion } from './PlanDayAccordion';
import { DeletePlanDialog } from './DeletePlanDialog';
import { deletePlan, activatePlan } from '@/services/workout-plans.service';
import { invalidatePlanCache } from '@/hooks/usePlan';
import { toast } from 'sonner';
import { Pencil, Zap } from 'lucide-react';
import type { WorkoutPlan } from '@/types/domain.types';

interface PlanDetailViewProps {
  plan: WorkoutPlan;
  onUpdate: () => void;
}

export function PlanDetailView({ plan, onUpdate }: PlanDetailViewProps) {
  const router = useRouter();

  const handleActivate = async () => {
    try {
      await activatePlan(plan.id);
      toast.success(`"${plan.name}" is now your active plan`);
      invalidatePlanCache(plan.id);
      onUpdate();
    } catch {
      toast.error('Failed to activate plan');
    }
  };

  const handleDelete = async () => {
    await deletePlan(plan.id);
    toast.success(`"${plan.name}" deleted`);
    invalidatePlanCache(plan.id);
    router.push('/workout');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold">{plan.name}</h1>
          {plan.isActive && (
            <Badge className="bg-green-500 text-white hover:bg-green-600">Active</Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          {plan.days.length} {plan.days.length === 1 ? 'day' : 'days'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {!plan.isActive && (
          <Button size="sm" onClick={handleActivate} className="flex cursor-pointer items-center gap-1.5">
            <Zap className="h-4 w-4" />
            Activate
          </Button>
        )}
        <Button size="sm" variant="outline" render={<Link href={`/workout/${plan.id}/edit`} />} className="flex cursor-pointer items-center gap-1.5">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
        <DeletePlanDialog planName={plan.name} onConfirm={handleDelete} />
      </div>

      {plan.days.length > 0 ? (
        <PlanDayAccordion days={plan.days} />
      ) : (
        <p className="text-muted-foreground py-4 text-center text-sm">
          No exercises added yet.
        </p>
      )}
    </div>
  );
}
