'use client';

import { useTranslation } from 'react-i18next';
import { MuscleRankingRow } from '@/components/stats/MuscleRankingRow';
import { Skeleton } from '@/components/ui/skeleton';
import type { WeightUnit } from '@/hooks/useStats';
import type { VolumeByMuscleResponse } from '@/types/domain.types';

interface MuscleRankingListProps {
  data: VolumeByMuscleResponse;
  loading: boolean;
  weightUnit: WeightUnit;
  convertVolume: (kg: number) => number;
}

export function MuscleRankingList({ data, loading, weightUnit, convertVolume }: MuscleRankingListProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (data.ranking.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        {t('stats.noData')}
      </p>
    );
  }

  const totalVolume = data.ranking.reduce((sum, item) => sum + convertVolume(item.volume), 0);

  return (
    <div className="space-y-3">
      {data.ranking.map((item) => (
        <MuscleRankingRow key={item.muscle} item={item} totalVolume={totalVolume} weightUnit={weightUnit} convertVolume={convertVolume} />
      ))}
    </div>
  );
}
