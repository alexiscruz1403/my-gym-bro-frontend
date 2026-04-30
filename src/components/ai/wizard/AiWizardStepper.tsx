import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEPS = [
  { number: 1, label: 'Perfil' },
  { number: 2, label: 'Objetivo' },
  { number: 3, label: 'Horario' },
  { number: 4, label: 'Equipo' },
  { number: 5, label: 'Límites' },
  { number: 6, label: 'Ejercicios' },
  { number: 7, label: 'Generar' },
];

interface AiWizardStepperProps {
  currentStep: number;
}

export function AiWizardStepper({ currentStep }: AiWizardStepperProps) {
  return (
    <div className="flex w-full items-center overflow-x-auto pt-2 pb-1">
      {STEPS.map((step, index) => {
        const isDone = step.number < currentStep;
        const isActive = step.number === currentStep;

        return (
          <div key={step.number} className="flex flex-1 items-center min-w-0">
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
                {isDone ? <Check className="h-3.5 w-3.5" /> : step.number}
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
                {step.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
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
