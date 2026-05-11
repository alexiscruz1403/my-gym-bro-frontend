import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

type StreakLevel = 'off' | 'low' | 'medium' | 'high' | 'golden';

function getStreakLevel(streak: number): StreakLevel {
  if (streak === 0) return 'off';
  if (streak < 30) return 'low';
  if (streak < 180) return 'medium';
  if (streak < 365) return 'high';
  return 'golden';
}

const levelConfig: Record<StreakLevel, { colorClass: string; animation?: string; glow?: boolean }> = {
  off: { colorClass: 'text-muted-foreground' },
  low: { colorClass: 'text-orange-400', animation: 'var(--animate-flame-gentle)' },
  medium: { colorClass: 'text-orange-500', animation: 'var(--animate-flame-moderate)' },
  high: { colorClass: 'text-red-500', animation: 'var(--animate-flame-strong)' },
  golden: { colorClass: 'text-yellow-400', animation: 'var(--animate-flame-strong)', glow: true },
};

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const level = getStreakLevel(streak);
  const config = levelConfig[level];

  return (
    <div className="flex items-center gap-1">
      <Flame
        className={cn('h-5 w-5', config.colorClass)}
        style={{
          animation: config.animation,
          filter: config.glow ? 'drop-shadow(0 0 6px rgba(250,204,21,0.7))' : undefined,
        }}
      />
      <span className={cn('text-sm font-semibold tabular-nums', config.colorClass)}>
        {streak}
      </span>
    </div>
  );
}
