import type { MuscleVolumeItem } from '@/types/domain.types';

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
};

interface MuscleRankingRowProps {
  item: MuscleVolumeItem;
  totalVolume: number;
}

export function MuscleRankingRow({ item, totalVolume }: MuscleRankingRowProps) {
  const percentage = totalVolume > 0 ? (item.volume / totalVolume) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground w-5 shrink-0 text-right text-sm tabular-nums">
        {item.rank}
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-medium">
            {MUSCLE_LABEL[item.muscle] ?? item.muscle}
          </span>
          <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
            {item.volume.toLocaleString('es')} kg · {item.sets} series
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
