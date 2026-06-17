import type { MuscleGroup } from '@/types/domain.types';
import type { RecoveryMap } from '@/types/recovery.types';

export const RECOVERY_COLORS = {
  FRESH: '#4ADE80',
  RECOVERED: '#FACC15',
  FATIGUED: '#F87171',
  UNTRAINED: 'oklch(30% 0 0)',
} as const;

export function getRecoveryFill(muscle: MuscleGroup, map: RecoveryMap): string {
  const item = map.get(muscle);
  if (!item) return RECOVERY_COLORS.UNTRAINED;
  return RECOVERY_COLORS[item.status];
}
