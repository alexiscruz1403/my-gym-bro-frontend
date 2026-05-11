'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface WizardStepperProps {
  currentStep: 1 | 2 | 3 | 4;
}

export function WizardStepper({ currentStep }: WizardStepperProps) {
  const { t } = useTranslation();

  const STEPS = [
    { number: 1, label: t('plans.wizard.steps.name') },
    { number: 2, label: t('plans.wizard.steps.days') },
    { number: 3, label: t('plans.wizard.steps.exercises') },
    { number: 4, label: t('plans.wizard.steps.review') },
  ];

  return (
    <div className="flex w-full items-center">
      {STEPS.map((step, index) => {
        const isDone = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <div key={step.number} className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  isDone && 'bg-primary text-primary-foreground',
                  isActive && 'bg-primary text-primary-foreground ring-2 ring-primary/30',
                  !isDone && !isActive && 'bg-muted text-muted-foreground',
                )}
              >
                {isDone ? '✓' : step.number}
              </div>
              <span
                className={cn(
                  'text-center text-xs',
                  isActive ? 'text-foreground font-medium' : 'text-muted-foreground',
                )}
              >
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'mb-5 h-px w-full max-w-10 flex-1 transition-colors',
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
