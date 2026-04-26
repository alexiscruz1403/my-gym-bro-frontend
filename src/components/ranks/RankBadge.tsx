import { getRankColor, getRankName } from '@/lib/ranks';
import type { RankLevel } from '@/types/domain.types';

interface RankBadgeProps {
  rank: RankLevel;
  showName?: boolean;
  size?: 'sm' | 'md';
}

export function RankBadge({ rank, showName = true, size = 'md' }: RankBadgeProps) {
  const color = getRankColor(rank);
  const name = getRankName(rank);

  const dotSize = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <span className={`inline-flex items-center gap-1 ${textSize} font-medium`}>
      <span
        className={`${dotSize} rounded-full shrink-0`}
        style={{ backgroundColor: color }}
      />
      {showName && <span style={{ color }}>{name}</span>}
    </span>
  );
}
