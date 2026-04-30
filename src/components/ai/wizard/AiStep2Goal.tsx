'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { step2GoalSchema, type Step2GoalValues } from '@/lib/validations/ai.schemas';
import type { AiFitnessGoal, AiExperienceLevel } from '@/types/domain.types';

const GOALS: { value: AiFitnessGoal; label: string; icon: string; description: string; color: string }[] = [
  { value: 'muscle_gain', label: 'Ganar músculo', icon: '💪', description: 'Hipertrofia y masa muscular', color: 'from-orange-500/10 to-orange-500/5 border-orange-500/30' },
  { value: 'fat_loss', label: 'Perder grasa', icon: '🔥', description: 'Déficit calórico y cardio', color: 'from-red-500/10 to-red-500/5 border-red-500/30' },
  { value: 'body_recomposition', label: 'Recomposición', icon: '⚖️', description: 'Músculo y pérdida de grasa', color: 'from-purple-500/10 to-purple-500/5 border-purple-500/30' },
  { value: 'strength', label: 'Fuerza', icon: '🏋️', description: 'Cargas máximas y powerlifting', color: 'from-blue-500/10 to-blue-500/5 border-blue-500/30' },
  { value: 'endurance', label: 'Resistencia', icon: '🏃', description: 'Capacidad cardiovascular', color: 'from-green-500/10 to-green-500/5 border-green-500/30' },
  { value: 'general_health', label: 'Salud general', icon: '❤️', description: 'Bienestar y movimiento', color: 'from-pink-500/10 to-pink-500/5 border-pink-500/30' },
  { value: 'mobility', label: 'Movilidad', icon: '🧘', description: 'Flexibilidad y rango de movimiento', color: 'from-teal-500/10 to-teal-500/5 border-teal-500/30' },
];

const EXPERIENCE_LEVELS: { value: AiExperienceLevel; label: string; subtitle: string; icon: string }[] = [
  { value: 'beginner', label: 'Principiante', subtitle: '0 – 6 meses', icon: '🌱' },
  { value: 'intermediate', label: 'Intermedio', subtitle: '6m – 2 años', icon: '🌿' },
  { value: 'advanced', label: 'Avanzado', subtitle: '+2 años', icon: '🌳' },
];

interface AiStep2GoalProps {
  defaultValues?: Partial<Step2GoalValues>;
  onNext: (values: Step2GoalValues) => void;
  onBack: () => void;
}

export function AiStep2Goal({ defaultValues, onNext, onBack }: AiStep2GoalProps) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step2GoalValues>({
    resolver: zodResolver(step2GoalSchema),
    defaultValues,
  });

  const selectedGoal = watch('goal');
  const selectedExp = watch('experience');

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">Tu objetivo y experiencia</h2>
        <p className="text-sm text-muted-foreground">
          Define hacia dónde vas y de dónde partes.
        </p>
      </div>

      {/* Goal cards */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Objetivo principal</p>
        <div className="grid grid-cols-2 gap-2.5">
          {GOALS.map((g) => (
            <motion.button
              key={g.value}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setValue('goal', g.value, { shouldValidate: true })}
              className={cn(
                'relative flex flex-col items-start gap-1 rounded-xl border-2 bg-gradient-to-br p-3 text-left transition-all duration-200 cursor-pointer',
                selectedGoal === g.value
                  ? `${g.color} shadow-sm`
                  : 'border-border bg-card hover:border-primary/30',
              )}
            >
              <span className="text-2xl">{g.icon}</span>
              <span className="text-sm font-semibold leading-tight">{g.label}</span>
              <span className="text-xs text-muted-foreground leading-tight">{g.description}</span>
              {selectedGoal === g.value && (
                <motion.div
                  layoutId="goal-check"
                  className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          ))}
        </div>
        {errors.goal && (
          <p className="text-destructive text-xs">{errors.goal.message}</p>
        )}
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Nivel de experiencia</p>
        <div className="grid grid-cols-3 gap-2">
          {EXPERIENCE_LEVELS.map((lvl) => (
            <motion.button
              key={lvl.value}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => setValue('experience', lvl.value, { shouldValidate: true })}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer',
                selectedExp === lvl.value
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-primary/30',
              )}
            >
              <span className="text-2xl">{lvl.icon}</span>
              <span className="text-xs font-semibold text-center">{lvl.label}</span>
              <span className="text-[10px] text-muted-foreground text-center">{lvl.subtitle}</span>
            </motion.button>
          ))}
        </div>
        {errors.experience && (
          <p className="text-destructive text-xs">{errors.experience.message}</p>
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
