'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { WeightUnit } from '@/hooks/useStats';
import type { MuscleVolumeItem } from '@/types/domain.types';

interface MuscleRankingRowProps {
  item: MuscleVolumeItem;
  totalVolume: number;
  weightUnit: WeightUnit;
  convertVolume: (kg: number) => number;
}

export function MuscleRankingRow({ item, totalVolume, weightUnit, convertVolume }: MuscleRankingRowProps) {
  const { t, i18n } = useTranslation();
  const converted = convertVolume(item.volume);
  const percentage = totalVolume > 0 ? (converted / totalVolume) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground w-5 shrink-0 text-right text-sm tabular-nums">
        {item.rank}
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-medium">
            {t(`exercises.muscle.${item.muscle}`, { defaultValue: item.muscle })}
          </span>
          <span className="text-muted-foreground shrink-0 text-xs tabular-nums flex items-center gap-1">
            {converted.toLocaleString(i18n.language)} {weightUnit} · {item.sets} {t('history.sets')}
            {item.changePercent !== null && item.changePercent !== undefined && (
              <span className={cn(
                'text-[10px] font-medium',
                item.changePercent > 0 && 'text-accent',
                item.changePercent < 0 && 'text-destructive',
                item.changePercent === 0 && 'text-muted-foreground',
              )}>
                {item.changePercent > 0 ? '↑' : item.changePercent < 0 ? '↓' : '='}{Math.abs(item.changePercent).toFixed(0)}%
              </span>
            )}
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
