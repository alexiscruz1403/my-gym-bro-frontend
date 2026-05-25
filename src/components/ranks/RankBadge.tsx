import { getRankColor, getRankName } from '@/lib/ranks';
import { cn } from '@/lib/utils';
import type { RankLevel } from '@/types/domain.types';

interface RankBadgeProps {
  rank: RankLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RankBadge({ rank, size = 'md', className }: RankBadgeProps) {
  const color = getRankColor(rank);
  const name = getRankName(rank);

  const sizeClass =
    size === 'sm'
      ? 'gap-1 px-2 py-[3px] text-[10px]'
      : size === 'lg'
        ? 'gap-[5px] px-3 py-1 text-[14px]'
        : 'gap-[5px] px-[10px] py-[3px] text-[12px]';

  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2';

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full font-semibold',
        sizeClass,
        className,
      )}
      style={{ background: color + '28', color }}
    >
      <span className={cn('rounded-full shrink-0', dotSize)} style={{ background: color }} />
      {name}
    </span>
  );
}
