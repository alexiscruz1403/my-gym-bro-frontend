'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { step2GoalSchema, type Step2GoalValues } from '@/lib/validations/ai.schemas';
import type { AiFitnessGoal, AiExperienceLevel } from '@/types/domain.types';

const GOAL_META: { value: AiFitnessGoal; icon: string; color: string }[] = [
  { value: 'muscle_gain', icon: '💪', color: 'from-orange-500/10 to-orange-500/5 border-orange-500/30' },
  { value: 'fat_loss', icon: '🔥', color: 'from-red-500/10 to-red-500/5 border-red-500/30' },
  { value: 'body_recomposition', icon: '⚖️', color: 'from-purple-500/10 to-purple-500/5 border-purple-500/30' },
  { value: 'strength', icon: '🏋️', color: 'from-blue-500/10 to-blue-500/5 border-blue-500/30' },
  { value: 'endurance', icon: '🏃', color: 'from-green-500/10 to-green-500/5 border-green-500/30' },
  { value: 'general_health', icon: '❤️', color: 'from-pink-500/10 to-pink-500/5 border-pink-500/30' },
  { value: 'mobility', icon: '🧘', color: 'from-teal-500/10 to-teal-500/5 border-teal-500/30' },
];

const EXPERIENCE_META: { value: AiExperienceLevel; icon: string }[] = [
  { value: 'beginner', icon: '🌱' },
  { value: 'intermediate', icon: '🌿' },
  { value: 'advanced', icon: '🌳' },
];

interface AiStep2GoalProps {
  defaultValues?: Partial<Step2GoalValues>;
  onNext: (values: Step2GoalValues) => void;
  onBack: () => void;
}

export function AiStep2Goal({ defaultValues, onNext, onBack }: AiStep2GoalProps) {
  const { t } = useTranslation();

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
        <h2 className="text-xl font-bold">{t('ai.wizard.step2.title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('ai.wizard.step2.description')}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{t('ai.wizard.step2.mainGoal')}</p>
        <div className="grid grid-cols-2 gap-2.5">
          {GOAL_META.map((g) => (
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
              <span className="text-sm font-semibold leading-tight">{t(`ai.wizard.step2.goals.${g.value}`)}</span>
              <span className="text-xs text-muted-foreground leading-tight">{t(`ai.wizard.step2.goalDescriptions.${g.value}`)}</span>
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

      <div className="space-y-2">
        <p className="text-sm font-medium">{t('ai.wizard.step2.experienceLevel')}</p>
        <div className="grid grid-cols-3 gap-2">
          {EXPERIENCE_META.map((lvl) => (
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
              <span className="text-xs font-semibold text-center">{t(`ai.wizard.step2.experience.${lvl.value}`)}</span>
              <span className="text-[10px] text-muted-foreground text-center">{t(`ai.wizard.step2.experienceSubtitles.${lvl.value}`)}</span>
            </motion.button>
          ))}
        </div>
        {errors.experience && (
          <p className="text-destructive text-xs">{errors.experience.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1 cursor-pointer" onClick={onBack}>
          {t('common.back')}
        </Button>
        <Button type="submit" className="flex-1 cursor-pointer" size="lg">
          {t('common.continue')}
        </Button>
      </div>
    </form>
  );
}
