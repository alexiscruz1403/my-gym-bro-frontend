'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Dumbbell, Play, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlanListItem } from '@/types/domain.types';

const DOW_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

function getTodayDow(): string {
  return DOW_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
}

interface PlanCardProps {
  plan: PlanListItem;
  onStart: (planId: string) => void;
  startLoading?: boolean;
}

export function PlanCard({ plan, onStart, startLoading }: PlanCardProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const todayDow = getTodayDow();

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-1 transition-[box-shadow,border-color] hover:shadow-2 hover:border-border/70">
      <div className="flex flex-col gap-2.5 px-4 pt-3.5 pb-3">
        {/* Name + badges */}
        <div>
          <p className="font-display text-[18px] font-bold leading-tight tracking-[0.01em]">
            {plan.name}
          </p>
          {(plan.isActive || plan.isAiGenerated) && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
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
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {t('plans.dayCount', { count: plan.daysCount })}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
            <Dumbbell className="h-3 w-3" />
            {t('plans.exerciseCount', { count: plan.totalExercises })}
          </span>
        </div>

        {/* Day pills */}
        {plan.configuredDays.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {plan.configuredDays.map((day) => (
              <span
                key={day}
                className={cn(
                  'font-display rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-[0.02em]',
                  day === todayDow
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-muted/60 text-muted-foreground',
                )}
              >
                {t(`daysShort.${day}`)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action row */}
      <div className="flex gap-2 border-t border-border px-4 py-3">
        <Button
          className="h-10 flex-1 cursor-pointer gap-1.5 text-sm font-semibold"
          onClick={() => onStart(plan.id)}
          disabled={startLoading}
        >
          <Play className="h-3 w-3 fill-current" />
          {t('plans.start')}
        </Button>
        <Button
          variant="outline"
          className="h-10 cursor-pointer gap-1 bg-muted/40 px-4 text-sm font-medium"
          onClick={() => router.push(`/workout/${plan.id}`)}
        >
          {t('plans.viewFull')}
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
