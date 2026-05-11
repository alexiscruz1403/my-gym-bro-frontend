'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { step5LimitationsSchema, type Step5LimitationsValues } from '@/lib/validations/ai.schemas';
import type { AiPhysicalLimitation, AiPreference } from '@/types/domain.types';

const LIMITATION_META: { value: AiPhysicalLimitation; icon: string }[] = [
  { value: 'knee_injury', icon: '🦵' },
  { value: 'lower_back_pain', icon: '🔙' },
  { value: 'shoulder_sensitivity', icon: '💪' },
  { value: 'previous_surgery', icon: '🏥' },
];

const PREFERENCE_META: { value: AiPreference; icon: string }[] = [
  { value: 'heavy_lifting', icon: '⚡' },
  { value: 'prefers_machines', icon: '🔧' },
  { value: 'prefers_free_weights', icon: '🏋️' },
  { value: 'hates_cardio', icon: '🚫' },
];

interface AiStep5LimitationsProps {
  defaultValues?: Partial<Step5LimitationsValues>;
  onNext: (values: Step5LimitationsValues) => void;
  onBack: () => void;
}

export function AiStep5Limitations({ defaultValues, onNext, onBack }: AiStep5LimitationsProps) {
  const { t } = useTranslation();

  const {
    handleSubmit,
    watch,
    setValue,
  } = useForm<Step5LimitationsValues>({
    resolver: zodResolver(step5LimitationsSchema),
    defaultValues: {
      physicalLimitations: defaultValues?.physicalLimitations ?? [],
      preferences: defaultValues?.preferences ?? [],
    },
  });

  const selectedLimits = watch('physicalLimitations') ?? [];
  const selectedPrefs = watch('preferences') ?? [];

  const toggleLimit = (val: AiPhysicalLimitation) => {
    const next = selectedLimits.includes(val)
      ? selectedLimits.filter((v) => v !== val)
      : [...selectedLimits, val];
    setValue('physicalLimitations', next);
  };

  const togglePref = (val: AiPreference) => {
    const next = selectedPrefs.includes(val)
      ? selectedPrefs.filter((v) => v !== val)
      : [...selectedPrefs, val];
    setValue('preferences', next);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-7">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">{t('ai.wizard.step5.title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('ai.wizard.step5.description')}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{t('ai.wizard.step5.physicalLimitations')}</p>
          {selectedLimits.length > 0 && (
            <button
              type="button"
              onClick={() => setValue('physicalLimitations', [])}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t('ai.wizard.step5.clear')}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LIMITATION_META.map((l) => {
            const isSelected = selectedLimits.includes(l.value);
            return (
              <motion.button
                key={l.value}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => toggleLimit(l.value)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border-2 px-3 py-3 text-left transition-all duration-200 cursor-pointer',
                  isSelected
                    ? 'border-destructive/60 bg-destructive/5 shadow-sm'
                    : 'border-border bg-card hover:border-border/60',
                )}
              >
                <span className="text-xl">{l.icon}</span>
                <span className="text-xs font-medium leading-tight">{t(`ai.wizard.step5.limitations.${l.value}`)}</span>
              </motion.button>
            );
          })}
        </div>
        {selectedLimits.length === 0 && (
          <p className="text-xs text-muted-foreground">{t('ai.wizard.step5.noneSelected')}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{t('ai.wizard.step5.trainingPreferences')}</p>
          {selectedPrefs.length > 0 && (
            <button
              type="button"
              onClick={() => setValue('preferences', [])}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t('ai.wizard.step5.clear')}
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PREFERENCE_META.map((p) => {
            const isSelected = selectedPrefs.includes(p.value);
            return (
              <motion.button
                key={p.value}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => togglePref(p.value)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border-2 px-3 py-3 text-left transition-all duration-200 cursor-pointer',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/20',
                )}
              >
                <span className="text-xl">{p.icon}</span>
                <span className="text-xs font-medium leading-tight">{t(`ai.wizard.step5.preferences.${p.value}`)}</span>
              </motion.button>
            );
          })}
        </div>
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
