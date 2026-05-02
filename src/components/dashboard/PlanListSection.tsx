'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDay } from 'date-fns';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getPlan } from '@/services/workout-plans.service';
import { startSession } from '@/services/sessions.service';
import useSessionStore from '@/store/session.store';
import { StartSessionSheet } from '@/components/session/StartSessionSheet';
import type { PlanListItem, WorkoutPlan, DayOfWeek } from '@/types/domain.types';

const DAY_INDEX_MAP: DayOfWeek[] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
];

function getTodayDayOfWeek(): DayOfWeek {
  return DAY_INDEX_MAP[getDay(new Date())];
}

interface PlanListSectionProps {
  title: string;
  plans: PlanListItem[];
}

export function PlanListSection({ title, plans }: PlanListSectionProps) {
  const router = useRouter();
  const { startSession: storeStartSession } = useSessionStore();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const todayDow = getTodayDayOfWeek();

  const handleOpenSheet = async (planId: string) => {
    setLoadingPlanId(planId);
    try {
      const plan = await getPlan(planId);
      setSelectedPlan(plan);
      setSheetOpen(true);
    } catch {
      toast.error('Could not load plan. Please try again.');
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleStart = async (dayOfWeek: DayOfWeek) => {
    if (!selectedPlan) return;
    try {
      const session = await startSession({ dayOfWeek, planId: selectedPlan.id });
      storeStartSession(session._id);
      setSheetOpen(false);
      router.push('/session');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 422) {
        toast.error('No exercises found for that day in this plan.');
      } else {
        toast.error('Could not start workout. Please try again.');
      }
    }
  };

  return (
    <>
      <div className="rounded-xl border bg-card overflow-hidden cursor-pointer">
        <Accordion multiple>
          <AccordionItem value="plans" className="border-none">
            <AccordionTrigger className="px-4 py-3.5 text-sm font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                {title}
                <Badge variant="secondary" className="font-normal text-xs">
                  {plans.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="space-y-2">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-background px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{plan.name}</p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        <span>{plan.daysCount} {plan.daysCount === 1 ? 'day' : 'days'}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="shrink-0 cursor-pointer gap-1.5"
                      disabled={loadingPlanId === plan.id}
                      onClick={() => handleOpenSheet(plan.id)}
                    >
                      {loadingPlanId === plan.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {selectedPlan && (
        <StartSessionSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          plan={selectedPlan}
          todayDow={todayDow}
          onStart={handleStart}
        />
      )}
    </>
  );
}
