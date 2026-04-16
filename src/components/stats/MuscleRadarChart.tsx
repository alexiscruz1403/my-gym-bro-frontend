'use client';

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

const SHORT_LABEL: Record<string, string> = {
  chest: 'Pecho',
  front_delts: 'D. Ant',
  side_delts: 'D. Lat',
  triceps: 'Tríceps',
  lats: 'Dorsal',
  upper_back: 'Esp. Alta',
  rear_delts: 'D. Post',
  biceps: 'Bíceps',
  forearms: 'Antebr.',
  traps: 'Trapecio',
  abs: 'Abs',
  obliques: 'Oblicuos',
  lower_back: 'Lumbar',
  quads: 'Cuáds',
  hamstrings: 'Isquios',
  glutes: 'Glúteos',
  calves: 'Gemelos',
  adductors: 'Aductor',
  abductors: 'Abductor',
};

interface MuscleRadarChartProps {
  data: VolumeByMuscleResponse;
  loading: boolean;
  convertVolume?: (kg: number) => number;
}

export function MuscleRadarChart({ data, loading, convertVolume }: MuscleRadarChartProps) {
  if (loading) {
    return <Skeleton className="h-75 w-full rounded-xl" />;
  }

  const chartData = data.ranking
    .filter((item) => item.volume > 0)
    .map((item) => ({
      muscle: SHORT_LABEL[item.muscle] ?? item.muscle,
      volume: convertVolume ? convertVolume(item.volume) : item.volume,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-75 items-center justify-center text-sm text-muted-foreground">
        Sin datos para este período
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="muscle"
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
        />
        <PolarRadiusAxis tick={false} axisLine={false} />
        <Radar
          dataKey="volume"
          fill="hsl(var(--primary))"
          fillOpacity={0.3}
          stroke="hsl(var(--primary))"
          strokeWidth={1.5}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
