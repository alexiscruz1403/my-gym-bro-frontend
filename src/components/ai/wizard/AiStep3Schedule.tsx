'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { step3ScheduleSchema, type Step3ScheduleValues } from '@/lib/validations/ai.schemas';

const DURATION_PRESETS = [30, 45, 60, 75, 90];

interface AiStep3ScheduleProps {
  defaultValues?: Partial<Step3ScheduleValues>;
  onNext: (values: Step3ScheduleValues) => void;
  onBack: () => void;
}

export function AiStep3Schedule({ defaultValues, onNext, onBack }: AiStep3ScheduleProps) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step3ScheduleValues>({
    resolver: zodResolver(step3ScheduleSchema),
    defaultValues: {
      daysPerWeek: defaultValues?.daysPerWeek,
      minutesPerSession: defaultValues?.minutesPerSession ?? 60,
    },
  });

  const days = watch('daysPerWeek');
  const minutes = watch('minutesPerSession') ?? 60;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-8">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">Tu disponibilidad</h2>
        <p className="text-sm text-muted-foreground">
          ¿Cuántos días entrenas y cuánto tiempo tienes?
        </p>
      </div>

      {/* Days per week */}
      <div className="space-y-4">
        <p className="text-sm font-medium">Días por semana</p>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5, 6].map((d) => (
            <motion.button
              key={d}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setValue('daysPerWeek', d, { shouldValidate: true })}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full text-base font-bold border-2 transition-all duration-200 cursor-pointer',
                days === d
                  ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30'
                  : 'border-border bg-card text-foreground hover:border-primary/50',
              )}
            >
              {d}
            </motion.button>
          ))}
        </div>
        {days && (
          <motion.p
            key={days}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-muted-foreground"
          >
            {days === 1
              ? '1 día a la semana'
              : `${days} días a la semana`}
          </motion.p>
        )}
        {errors.daysPerWeek && (
          <p className="text-destructive text-xs text-center">{errors.daysPerWeek.message}</p>
        )}
      </div>

      {/* Minutes per session */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Duración por sesión</p>
          <span className="text-2xl font-bold tabular-nums">
            {minutes}
            <span className="text-sm font-normal text-muted-foreground ml-1">min</span>
          </span>
        </div>

        {/* Preset chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {DURATION_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setValue('minutesPerSession', p, { shouldValidate: true })}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-all duration-150 cursor-pointer',
                minutes === p
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/50',
              )}
            >
              {p}m
            </button>
          ))}
        </div>

        <input
          type="range"
          min={20}
          max={180}
          step={5}
          value={minutes}
          onChange={(e) =>
            setValue('minutesPerSession', Number(e.target.value), { shouldValidate: true })
          }
          className="w-full accent-primary h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>20 min</span>
          <span>180 min</span>
        </div>
        {errors.minutesPerSession && (
          <p className="text-destructive text-xs">{errors.minutesPerSession.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1 cursor-pointer" onClick={onBack}>
          Atrás
        </Button>
        <Button type="submit" className="flex-1 cursor-pointer" size="lg">
          Continuar
        </Button>
      </div>
    </form>
  );
}
