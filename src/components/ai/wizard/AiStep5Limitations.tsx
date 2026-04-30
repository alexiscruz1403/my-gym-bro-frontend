'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { step5LimitationsSchema, type Step5LimitationsValues } from '@/lib/validations/ai.schemas';
import type { AiPhysicalLimitation, AiPreference } from '@/types/domain.types';

const LIMITATIONS: { value: AiPhysicalLimitation; label: string; icon: string }[] = [
  { value: 'knee_injury', label: 'Lesión de rodilla', icon: '🦵' },
  { value: 'lower_back_pain', label: 'Dolor lumbar', icon: '🔙' },
  { value: 'shoulder_sensitivity', label: 'Hombro sensible', icon: '💪' },
  { value: 'previous_surgery', label: 'Cirugía previa', icon: '🏥' },
];

const PREFERENCES: { value: AiPreference; label: string; icon: string }[] = [
  { value: 'heavy_lifting', label: 'Entrenar pesado', icon: '⚡' },
  { value: 'prefers_machines', label: 'Máquinas', icon: '🔧' },
  { value: 'prefers_free_weights', label: 'Peso libre', icon: '🏋️' },
  { value: 'hates_cardio', label: 'Sin cardio', icon: '🚫' },
];

interface AiStep5LimitationsProps {
  defaultValues?: Partial<Step5LimitationsValues>;
  onNext: (values: Step5LimitationsValues) => void;
  onBack: () => void;
}

export function AiStep5Limitations({ defaultValues, onNext, onBack }: AiStep5LimitationsProps) {
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
        <h2 className="text-xl font-bold">Limitaciones y preferencias</h2>
        <p className="text-sm text-muted-foreground">
          Opcional. La IA adaptará el plan a tu situación.
        </p>
      </div>

      {/* Physical limitations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Limitaciones físicas</p>
          {selectedLimits.length > 0 && (
            <button
              type="button"
              onClick={() => setValue('physicalLimitations', [])}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LIMITATIONS.map((l) => {
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
                <span className="text-xs font-medium leading-tight">{l.label}</span>
              </motion.button>
            );
          })}
        </div>
        {selectedLimits.length === 0 && (
          <p className="text-xs text-muted-foreground">Ninguna seleccionada</p>
        )}
      </div>

      {/* Preferences */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Preferencias de entrenamiento</p>
          {selectedPrefs.length > 0 && (
            <button
              type="button"
              onClick={() => setValue('preferences', [])}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PREFERENCES.map((p) => {
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
                <span className="text-xs font-medium leading-tight">{p.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1 cursor-pointer" onClick={onBack}>
          Atrás
        </Button>
        <Button type="submit" className="flex-1 cursor-pointer" size="lg">
          Generar plan ✨
        </Button>
      </div>
    </form>
  );
}
