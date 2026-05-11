'use client';

import { useTranslation } from 'react-i18next';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import type { VolumeByMuscleResponse } from '@/types/domain.types';

interface MuscleRadarChartProps {
  data: VolumeByMuscleResponse;
  loading: boolean;
  convertVolume?: (kg: number) => number;
}

export function MuscleRadarChart({ data, loading, convertVolume }: MuscleRadarChartProps) {
  const { t } = useTranslation();

  if (loading) {
    return <Skeleton className="h-75 w-full rounded-xl" />;
  }

  const chartData = data.ranking
    .filter((item) => item.volume > 0)
    .map((item) => ({
      muscle: t(`exercises.muscleShort.${item.muscle}`, { defaultValue: item.muscle }),
      volume: convertVolume ? convertVolume(item.volume) : item.volume,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-75 items-center justify-center text-sm text-muted-foreground">
        {t('stats.noData')}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="muscle"
          tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
        />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <Radar
          dataKey="volume"
          fill="var(--primary)"
          fillOpacity={0.3}
          stroke="var(--primary)"
          strokeWidth={1.5}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
