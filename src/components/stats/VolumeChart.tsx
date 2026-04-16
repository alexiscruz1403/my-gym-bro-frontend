'use client';

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
import type { VolumeByPeriodResponse, StatsPeriod } from '@/types/domain.types';

interface VolumeChartProps {
  data: VolumeByPeriodResponse;
  period: StatsPeriod;
  loading: boolean;
}

export function VolumeChart({ data, period, loading }: VolumeChartProps) {
  if (loading) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  const chartData = data.breakdown.map((item) => ({
    label: formatBreakdownLabel(period, item.label),
    volume: item.volume,
    sets: item.sets,
  }));

  return (
    <div className="space-y-3">
      <div className="flex gap-6 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Volumen total</p>
          <p className="font-display font-bold flex items-center">
            {data.totalVolume.toLocaleString('es')}
            <span className="text-muted-foreground ml-1 text-xs font-normal">kg</span>
            {data.changePercent !== null && data.changePercent !== undefined && (
              <span className={cn(
                'ml-1.5 text-[10px] font-medium rounded-full px-1.5 py-0.5',
                data.changePercent > 0 && 'bg-accent/15 text-accent',
                data.changePercent < 0 && 'bg-destructive/15 text-destructive',
                data.changePercent === 0 && 'bg-muted text-muted-foreground',
              )}>
                {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(1)}%
              </span>
            )}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Series</p>
          <p className="font-display font-bold">{data.totalSets}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Sesiones</p>
          <p className="font-display font-bold">{data.totalSessions}</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          Sin datos para este período
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={192}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 8, bottom: 0 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              formatter={(value) => [`${value} kg`, 'Volumen']}
              cursor={{ fill: 'rgba(255,255,255,0.08)' }}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: '1px solid hsl(var(--border))',
                background: 'hsl(var(--popover))',
                color: 'hsl(var(--popover-foreground))',
              }}
            />
            <Bar dataKey="volume" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {chartData.map((_, index) => (
                <Cell key={index} fill="hsl(var(--primary))" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
