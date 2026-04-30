'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { step4EquipmentSchema, type Step4EquipmentValues } from '@/lib/validations/ai.schemas';
import type { AiEquipment } from '@/types/domain.types';

const EQUIPMENT_OPTIONS: {
  value: AiEquipment;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    value: 'no_equipment',
    label: 'Sin material',
    icon: '🏠',
    description: 'Solo peso corporal en casa',
  },
  {
    value: 'dumbbells',
    label: 'Mancuernas',
    icon: '🏋️',
    description: 'Par de mancuernas ajustables',
  },
  {
    value: 'bands',
    label: 'Bandas elásticas',
    icon: '🎯',
    description: 'Bandas de resistencia',
  },
  {
    value: 'barbell_plates',
    label: 'Barra + discos',
    icon: '🔩',
    description: 'Barra olímpica con discos',
  },
  {
    value: 'full_gym',
    label: 'Gimnasio completo',
    icon: '🏢',
    description: 'Acceso a toda la maquinaria',
  },
];

interface AiStep4EquipmentProps {
  defaultValues?: Partial<Step4EquipmentValues>;
  onNext: (values: Step4EquipmentValues) => void;
  onBack: () => void;
}

export function AiStep4Equipment({ defaultValues, onNext, onBack }: AiStep4EquipmentProps) {
  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step4EquipmentValues>({
    resolver: zodResolver(step4EquipmentSchema),
    defaultValues: { equipment: defaultValues?.equipment ?? [] },
  });

  const selected = watch('equipment') ?? [];

  const toggle = (value: AiEquipment) => {
    const current = selected ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue('equipment', next, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">Equipamiento disponible</h2>
        <p className="text-sm text-muted-foreground">
          Selecciona todo lo que tienes acceso. Puedes elegir varios.
        </p>
      </div>

      <div className="space-y-2.5">
        {EQUIPMENT_OPTIONS.map((eq) => {
          const isSelected = selected.includes(eq.value);
          return (
            <motion.button
              key={eq.value}
              type="button"
              whileTap={{ scale: 0.985 }}
              onClick={() => toggle(eq.value)}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 cursor-pointer',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-primary/30',
              )}
            >
              <span className="text-3xl">{eq.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{eq.label}</p>
                <p className="text-xs text-muted-foreground">{eq.description}</p>
              </div>
              <div
                className={cn(
                  'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  isSelected
                    ? 'border-primary bg-primary'
                    : 'border-border',
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {errors.equipment && (
        <p className="text-destructive text-xs">{errors.equipment.message}</p>
      )}

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
