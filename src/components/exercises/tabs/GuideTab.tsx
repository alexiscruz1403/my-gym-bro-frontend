'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MuscleGroupBadge } from '@/components/exercises/MuscleGroupBadge';
import { Dumbbell, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Exercise, WeightInstruction } from '@/types/domain.types';

const LOAD_TYPE_LABELS: Record<string, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  machine: 'Machine',
  bodyweight: 'Bodyweight',
  cable: 'Cable',
  kettlebell: 'Kettlebell',
  resistance_band: 'Resistance Band',
};

const WEIGHT_INSTRUCTION_LABELS: Record<WeightInstruction, string> = {
  barbell_sum: 'La carga es la suma de todos los discos + barra',
  machine_display: 'Usa el peso que indica la máquina',
  machine_sum_sides: 'La carga es la suma de ambos lados',
  bodyweight: 'Solo usa tu peso corporal',
  no_weight: 'Sin carga adicional',
  cable_display: 'Usa el peso que muestra el cable',
  cable_sum_sides: 'La carga es la suma de ambos lados del cable',
  each_side_weight: 'Registra el peso de cada lado por separado',
};

interface GuideTabProps {
  exercise: Exercise;
}

export function GuideTab({ exercise }: GuideTabProps) {
  const { i18n } = useTranslation();
  const displayName = exercise.name[i18n.language as 'es' | 'en'] ?? exercise.name.en;

  return (
    <div className="space-y-6 pt-4">
      {exercise.gifUrl ? (
        <div className="overflow-hidden rounded-xl">
          <img
            src={exercise.gifUrl}
            alt={displayName}
            className="w-full object-cover"
          />
        </div>
      ) : (
        <div className="bg-muted flex h-40 items-center justify-center rounded-xl">
          <Dumbbell className="text-muted-foreground h-12 w-12" />
        </div>
      )}

      {exercise.videoUrl && (
        <div className="overflow-hidden rounded-xl">
          <video
            src={exercise.videoUrl}
            controls
            className="w-full"
            aria-label={`Video de ${displayName}`}
          />
        </div>
      )}

      <div className="space-y-1">
        <h2 className="font-display text-xl font-bold">{displayName}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{LOAD_TYPE_LABELS[exercise.loadType]}</Badge>
          <Badge variant="outline">{exercise.bilateral ? 'Bilateral' : 'Unilateral'}</Badge>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-sm font-medium">Músculos primarios</p>
        <div className="flex flex-wrap gap-2">
          {exercise.musclesPrimary.map((m) => (
            <MuscleGroupBadge key={m} muscle={m} variant="default" />
          ))}
        </div>
      </div>

      {exercise.musclesSecondary.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Músculos secundarios</p>
          <div className="flex flex-wrap gap-2">
            {exercise.musclesSecondary.map((m) => (
              <MuscleGroupBadge key={m} muscle={m} variant="secondary" />
            ))}
          </div>
        </div>
      )}

      {exercise.weightGuide && (
        <>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Cómo marcar el peso</p>
            <div className="flex items-start gap-2 rounded-lg bg-muted p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm">
                  {WEIGHT_INSTRUCTION_LABELS[exercise.weightGuide.instruction]}
                </p>
                {exercise.weightGuide.note && (
                  <p className="text-xs text-muted-foreground">{exercise.weightGuide.note}</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
