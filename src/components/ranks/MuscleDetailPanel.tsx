import { X } from 'lucide-react';
import { RankBadge } from '@/components/ranks/RankBadge';
import type { MuscleRankItem } from '@/types/domain.types';

const MUSCLE_LABEL: Record<string, string> = {
  chest: 'Pecho',
  front_delts: 'Deltoides ant.',
  side_delts: 'Deltoides lat.',
  triceps: 'Tríceps',
  lats: 'Dorsales',
  upper_back: 'Espalda alta',
  rear_delts: 'Deltoides post.',
  biceps: 'Bíceps',
  forearms: 'Antebrazos',
  traps: 'Trapecios',
  abs: 'Abdominales',
  obliques: 'Oblicuos',
  lower_back: 'Lumbar',
  quads: 'Cuádriceps',
  hamstrings: 'Isquiotibiales',
  glutes: 'Glúteos',
  calves: 'Gemelos',
  adductors: 'Aductores',
  abductors: 'Abductores',
};

interface MuscleDetailPanelProps {
  item: MuscleRankItem;
  onClose: () => void;
}

export function MuscleDetailPanel({ item, onClose }: MuscleDetailPanelProps) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{MUSCLE_LABEL[item.muscle] ?? item.muscle}</span>
          <RankBadge rank={item.rank} />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {item.exercises.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">Sin ejercicios registrados para este músculo.</p>
      ) : (
        <div className="space-y-2">
          {item.exercises.map((ex) => (
            <div key={ex.exerciseId} className="flex items-center justify-between gap-2">
              <span className="text-sm truncate">{ex.exerciseName}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground tabular-nums">
                  {ex.bestValue.toLocaleString('es', { maximumFractionDigits: 1 })}
                </span>
                <RankBadge rank={ex.rank} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
