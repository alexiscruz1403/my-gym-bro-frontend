'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import type { SessionExercise } from '@/types/domain.types';

interface WarmupCalculatorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: SessionExercise | null;
}

function calcWarmupSets(
  plannedWeightKg: number,
  weightUnit: 'kg' | 'lbs',
  multiplier: 2.5 | 5,
): { set: number; weight: number; unit: 'kg' | 'lbs' }[] {
  const displayWeight = weightUnit === 'lbs' ? plannedWeightKg * 2.20462 : plannedWeightKg;
  return [0.4, 0.6, 0.8].map((pct, i) => {
    const rounded = Math.round((displayWeight * pct) / multiplier) * multiplier;
    return { set: i + 1, weight: Math.max(rounded, multiplier), unit: weightUnit };
  });
}

function formatWeight(weight: number): string {
  return Number.isInteger(weight) ? String(weight) : weight.toFixed(1);
}

export function WarmupCalculatorSheet({ open, onOpenChange, exercise }: WarmupCalculatorSheetProps) {
  const { t } = useTranslation();
  const [multiplier, setMultiplier] = useState<2.5 | 5>(2.5);

  const weightUnit = exercise?.weightUnit ?? 'kg';
  const plannedWeight = exercise?.plannedWeight ?? 0;
  const hasWeight = plannedWeight > 0;
  const warmupSets = hasWeight ? calcWarmupSets(plannedWeight, weightUnit, multiplier) : [];

  const displayPlannedWeight =
    weightUnit === 'lbs'
      ? formatWeight(plannedWeight * 2.20462)
      : formatWeight(plannedWeight);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="flex max-h-[88vh] flex-col gap-0 rounded-t-[20px] border-0 pt-0"
        style={{ background: 'var(--sheet-bg)' }}
      >
        {/* Drag handle */}
        <div className="mx-auto mt-3 mb-0 h-1 w-10 shrink-0 rounded-full bg-border" />

        {/* Header */}
        <div className="shrink-0 border-b border-border px-[18px] pb-3.5 pt-2">
          <SheetTitle className="font-display mt-1.5 text-[19px] font-bold tracking-[0.02em] text-foreground">
            {t('session.warmup.title')}
          </SheetTitle>
          {exercise && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {exercise.exerciseName}
              {hasWeight && (
                <span className="ml-2 font-medium text-foreground">
                  · {t('session.warmup.targetWeight')}: {displayPlannedWeight} {weightUnit}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4 space-y-4">
          {!hasWeight ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {t('session.warmup.noWeight')}
            </p>
          ) : (
            <>
              {/* Multiplier toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground shrink-0">
                  {t('session.warmup.multiplierLabel')}
                </span>
                <div className="flex gap-2">
                  {([2.5, 5] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMultiplier(m)}
                      className={`cursor-pointer rounded border px-3 py-1 text-sm transition-colors ${
                        multiplier === m
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      {m} kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Warmup set rows */}
              <div className="space-y-2">
                {warmupSets.map(({ set, weight, unit }) => (
                  <div
                    key={set}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                  >
                    <span className="text-sm font-medium">
                      {t('session.warmup.setLabel', { n: set })}
                    </span>
                    <span className="font-display text-lg font-bold tabular-nums">
                      {formatWeight(weight)}{' '}
                      <span className="text-sm font-normal text-muted-foreground">{unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
