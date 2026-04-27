'use client';

import dynamic from 'next/dynamic';
import { useExerciseStats } from '@/hooks/useExerciseStats';
import { PeriodSelector } from '@/components/stats/PeriodSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { cn } from '@/lib/utils';

const VolumeChart = dynamic(
  () => import('@/components/stats/VolumeChart').then((m) => m.VolumeChart),
  { ssr: false, loading: () => <Skeleton className="h-48 w-full rounded-xl" /> },
);

interface StatsTabProps {
  exerciseId: string;
}

export function StatsTab({ exerciseId }: StatsTabProps) {
  const {
    period,
    date,
    setPeriod,
    setDate,
    volumeData,
    loading,
    error,
    weightUnit,
    setWeightUnit,
    convertVolume,
  } = useExerciseStats(exerciseId);

  return (
    <div className="space-y-6 pt-4">
      <PeriodSelector
        period={period}
        date={date}
        onPeriodChange={setPeriod}
        onDateChange={setDate}
      />

      {volumeData?.hasLbsExercises && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Unidad:</span>
          <div className="flex overflow-hidden rounded-md border text-xs">
            {(['kg', 'lbs'] as const).map((unit, i) => (
              <button
                key={unit}
                type="button"
                onClick={() => setWeightUnit(unit)}
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
      )}

      {!loading && error && (
        <EmptyState
          title="Error al cargar estadísticas"
          description="No se pudieron obtener los datos. Intenta de nuevo."
        />
      )}

      {(loading || (!error && volumeData)) && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Volumen por período</p>
          {loading || !volumeData ? (
            <VolumeChart
              data={{ period, date, from: '', to: '', totalVolume: 0, totalSets: 0, totalSessions: 0, breakdown: [], hasLbsExercises: false, previousTotalVolume: 0, changePercent: null }}
              period={period}
              loading={true}
              weightUnit={weightUnit}
              convertVolume={convertVolume}
            />
          ) : (
            <VolumeChart
              data={volumeData}
              period={period}
              loading={false}
              weightUnit={weightUnit}
              convertVolume={convertVolume}
            />
          )}
        </div>
      )}
    </div>
  );
}
