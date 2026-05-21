'use client';

import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { formatBreakdownLabel } from '@/lib/stats-dates';
import type { WeightUnit } from '@/hooks/useStats';
import type { VolumeByPeriodResponse, StatsPeriod } from '@/types/domain.types';

interface VolumeChartProps {
  data: VolumeByPeriodResponse;
  period: StatsPeriod;
  loading: boolean;
  weightUnit: WeightUnit;
  convertVolume: (kg: number) => number;
}

export function VolumeChart({ data, period, loading, weightUnit, convertVolume }: VolumeChartProps) {
  const { t, i18n } = useTranslation();

  if (loading) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  const chartData = data.breakdown.map((item) => ({
    label: formatBreakdownLabel(period, item.label),
    volume: convertVolume(item.volume),
    sets: item.sets,
  }));

  return (
    <div className="space-y-3">
      {chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          {t('stats.noData')}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={192}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 8, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              formatter={(value) => [`${value} ${weightUnit}`, t('stats.volumeTooltip')]}
              cursor={{ fill: 'rgba(255,255,255,0.08)' }}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--popover))',
                color: 'var(--foreground)',
              }}
              itemStyle={{ color: 'var(--foreground)' }}
            />
            <Bar dataKey="volume" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((_, index) => (
                <Cell key={index} fill="var(--primary)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
