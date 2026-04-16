import { MuscleRankingRow } from '@/components/stats/MuscleRankingRow';
import { Skeleton } from '@/components/ui/skeleton';
import type { VolumeByMuscleResponse } from '@/types/domain.types';

interface MuscleRankingListProps {
  data: VolumeByMuscleResponse;
  loading: boolean;
}

export function MuscleRankingList({ data, loading }: MuscleRankingListProps) {
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
        Sin datos para este período
      </p>
    );
  }

  const totalVolume = data.ranking.reduce((sum, item) => sum + item.volume, 0);

  return (
    <div className="space-y-3">
      {data.ranking.map((item) => (
        <MuscleRankingRow key={item.muscle} item={item} totalVolume={totalVolume} />
      ))}
    </div>
  );
}
