import dynamic from 'next/dynamic';
import { PeriodSelector } from '@/components/stats/PeriodSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';

const VolumeChart = dynamic(
  () => import('@/components/stats/VolumeChart').then((m) => m.VolumeChart),
  { ssr: false, loading: () => <Skeleton className="h-48 w-full rounded-xl" /> },
);

const MuscleRankingList = dynamic(
  () => import('@/components/stats/MuscleRankingList').then((m) => m.MuscleRankingList),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
    ),
  },
);
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { WeightUnit } from '@/hooks/useStats';
import type { StatsPeriod, VolumeByPeriodResponse, VolumeByMuscleResponse } from '@/types/domain.types';

interface StatsPanelProps {
  period: StatsPeriod;
  date: string;
  volumeData: VolumeByPeriodResponse | null;
  muscleData: VolumeByMuscleResponse | null;
  loading: boolean;
  error: string | null;
  onPeriodChange: (period: StatsPeriod) => void;
  onDateChange: (date: string) => void;
  onRetry: () => void;
  weightUnit: WeightUnit;
  onWeightUnitChange: (unit: WeightUnit) => void;
  convertVolume: (kg: number) => number;
}

export function StatsPanel({
  period,
  date,
  volumeData,
  muscleData,
  loading,
  error,
  onPeriodChange,
  onDateChange,
  onRetry,
  weightUnit,
  onWeightUnitChange,
  convertVolume,
}: StatsPanelProps) {
  return (
    <div className="space-y-6">
      <PeriodSelector
        period={period}
        date={date}
        onPeriodChange={onPeriodChange}
        onDateChange={onDateChange}
      />

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Unidad:</span>
        <div className="flex overflow-hidden rounded-md border text-xs">
          {(['kg', 'lbs'] as const).map((unit, i) => (
            <button
              key={unit}
              type="button"
              onClick={() => onWeightUnitChange(unit)}
              className={cn(
                'cursor-pointer px-2 py-0.5 transition-colors',
                i > 0 && 'border-l',
                weightUnit === unit
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>

      {!loading && error && (
        <EmptyState
          title="Error al cargar estadísticas"
          description="No se pudieron obtener los datos. Intenta de nuevo."
          action={
            <Button variant="outline" size="sm" onClick={onRetry}>
              Reintentar
            </Button>
          }
        />
      )}

      {(loading || (!error && volumeData)) && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium">Volumen por período</h2>
          {loading || !volumeData ? (
            <VolumeChart
              data={{ period, date, from: '', to: '', totalVolume: 0, totalSets: 0, totalSessions: 0, breakdown: [], hasLbsExercises: false, previousTotalVolume: 0, changePercent: null }}
              period={period}
              loading={true}
              weightUnit={weightUnit}
              convertVolume={convertVolume}
            />
          ) : (
            <VolumeChart data={volumeData} period={period} loading={false} weightUnit={weightUnit} convertVolume={convertVolume} />
          )}
        </div>
      )}

      {(loading || (!error && muscleData)) && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium">Volumen por músculo</h2>
          {loading || !muscleData ? (
            <MuscleRankingList
              data={{ period, date, from: '', to: '', ranking: [], hasLbsExercises: false }}
              loading={true}
              weightUnit={weightUnit}
              convertVolume={convertVolume}
            />
          ) : (
            <MuscleRankingList data={muscleData} loading={false} weightUnit={weightUnit} convertVolume={convertVolume} />
          )}
        </div>
      )}
    </div>
  );
}
