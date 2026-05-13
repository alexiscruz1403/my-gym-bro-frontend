'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { usePlanGoals } from '@/hooks/usePlanGoals';
import type { AiFitnessGoal, MuscleGroup, WorkoutPlan } from '@/types/domain.types';

const PLAN_GOALS: AiFitnessGoal[] = [
  'muscle_gain',
  'fat_loss',
  'body_recomposition',
  'strength',
  'endurance',
  'general_health',
  'mobility',
];

const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'lats', 'upper_back', 'traps',
  'front_delts', 'side_delts', 'rear_delts',
  'biceps', 'triceps', 'forearms',
  'abs', 'obliques', 'lower_back',
  'quads', 'hamstrings', 'glutes', 'calves',
  'adductors', 'abductors',
];

interface PlanGoalsSectionProps {
  plan: WorkoutPlan;
  isPremium: boolean;
}

export function PlanGoalsSection({ plan, isPremium }: PlanGoalsSectionProps) {
  const { t } = useTranslation();
  const { updateGoals, isUpdating } = usePlanGoals(plan.id);

  const [selectedGoal, setSelectedGoal] = useState<AiFitnessGoal | null>(plan.goals?.mainGoal ?? null);
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>(
    plan.goals?.focusMuscles ?? [],
  );

  const isDirty =
    selectedGoal !== (plan.goals?.mainGoal ?? null) ||
    JSON.stringify([...selectedMuscles].sort()) !==
      JSON.stringify([...(plan.goals?.focusMuscles ?? [])].sort());

  const toggleMuscle = (muscle: MuscleGroup) => {
    setSelectedMuscles((prev) => {
      if (prev.includes(muscle)) return prev.filter((m) => m !== muscle);
      if (prev.length >= 3) return prev;
      return [...prev, muscle];
    });
  };

  const handleSave = async () => {
    try {
      await updateGoals({ mainGoal: selectedGoal, focusMuscles: selectedMuscles });
      toast.success(t('plans.goals.saved'));
    } catch {
      toast.error(t('plans.goals.saveError'));
    }
  };

  if (!isPremium) {
    return (
      <Card className="border-amber-500/30 bg-amber-50/30 dark:bg-amber-950/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base">{t('plans.goals.title')}</CardTitle>
          </div>
          <p className="text-muted-foreground text-sm">{t('plans.goals.premiumDescription')}</p>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            render={<Link href="/settings" />}
          >
            {t('plans.goals.premiumCta')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('plans.goals.title')}</CardTitle>
        <p className="text-muted-foreground text-xs">{t('plans.goals.description')}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Main goal */}
        <div className="space-y-2">
          <p className="text-sm font-medium">{t('plans.goals.goalLabel')}</p>
          <div className="flex flex-wrap gap-2">
            {PLAN_GOALS.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setSelectedGoal(selectedGoal === goal ? null : goal)}
                className={cn(
                  'cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors',
                  selectedGoal === goal
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
                )}
              >
                {t(`ai.planCard.goal.${goal}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Muscle focus */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{t('plans.goals.muscleFocusLabel')}</p>
            <span className="text-muted-foreground text-xs">
              {t('plans.goals.muscleFocusHint')}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MUSCLE_GROUPS.map((muscle) => {
              const isSelected = selectedMuscles.includes(muscle);
              const isDisabled = !isSelected && selectedMuscles.length >= 3;
              return (
                <button
                  key={muscle}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggleMuscle(muscle)}
                  className={cn(
                    'cursor-pointer rounded-full border px-2.5 py-0.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
                  )}
                >
                  {t(`exercises.muscle.${muscle}`)}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!isDirty || isUpdating}
          className={cn('w-full', !isDirty || isUpdating ? 'cursor-not-allowed' : 'cursor-pointer')}
        >
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUpdating ? t('plans.goals.saving') : t('plans.goals.save')}
        </Button>
      </CardContent>
    </Card>
  );
}
