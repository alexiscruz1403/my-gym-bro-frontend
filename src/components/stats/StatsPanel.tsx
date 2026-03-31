import { PeriodSelector } from '@/components/stats/PeriodSelector';
import { VolumeChart } from '@/components/stats/VolumeChart';
import { MuscleRankingList } from '@/components/stats/MuscleRankingList';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
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
}: StatsPanelProps) {
  return (
    <div className="space-y-6">
      <PeriodSelector
        period={period}
        date={date}
        onPeriodChange={onPeriodChange}
        onDateChange={onDateChange}
      />

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
              data={{ period, date, from: '', to: '', totalVolume: 0, totalSets: 0, totalSessions: 0, breakdown: [] }}
              period={period}
              loading={true}
            />
          ) : (
            <VolumeChart data={volumeData} period={period} loading={false} />
          )}
        </div>
      )}

      {(loading || (!error && muscleData)) && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium">Volumen por músculo</h2>
          {loading || !muscleData ? (
            <MuscleRankingList
              data={{ period, date, from: '', to: '', ranking: [] }}
              loading={true}
            />
          ) : (
            <MuscleRankingList data={muscleData} loading={false} />
          )}
        </div>
      )}
    </div>
  );
}
