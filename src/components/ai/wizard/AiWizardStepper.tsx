'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEP_KEYS = ['profile', 'goal', 'schedule', 'equipment', 'limits', 'exercises', 'generate'] as const;

interface AiWizardStepperProps {
  currentStep: number;
}

export function AiWizardStepper({ currentStep }: AiWizardStepperProps) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full items-center overflow-x-auto pt-2 pb-1">
      {STEP_KEYS.map((key, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={key} className="flex flex-1 items-center min-w-0">
            <div className="flex flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300',
                  isDone &&
                    'bg-primary text-primary-foreground shadow-sm shadow-primary/40',
                  isActive &&
                    'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110',
                  !isDone &&
                    !isActive &&
                    'bg-muted text-muted-foreground',
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : stepNumber}
              </div>
              <span
                className={cn(
                  'text-center text-[10px] leading-tight whitespace-nowrap',
                  isActive
                    ? 'text-foreground font-semibold'
                    : isDone
                      ? 'text-primary/80'
                      : 'text-muted-foreground',
                )}
              >
                {t(`ai.wizard.steps.${key}`)}
              </span>
            </div>

            {index < STEP_KEYS.length - 1 && (
              <div
                className={cn(
                  'mb-5 h-px flex-1 min-w-2 max-w-8 transition-all duration-500',
                  isDone ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
