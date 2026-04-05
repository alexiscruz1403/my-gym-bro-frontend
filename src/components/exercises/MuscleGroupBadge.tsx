import { Badge } from '@/components/ui/badge';
import type { MuscleGroup } from '@/types/domain.types';

const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Chest',
  lats: 'Lats',
  upper_back: 'Upper Back',
  traps: 'Traps',
  front_delts: 'Front Delts',
  side_delts: 'Side Delts',
  rear_delts: 'Rear Delts',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  abs: 'Abs',
  obliques: 'Obliques',
  lower_back: 'Lower Back',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  adductors: 'Adductors',
  abductors: 'Abductors',
};

interface MuscleGroupBadgeProps {
  muscle: MuscleGroup;
  variant?: 'default' | 'secondary' | 'outline';
}

export function MuscleGroupBadge({
  muscle,
  variant = 'secondary',
}: MuscleGroupBadgeProps) {
  return <Badge variant={variant}>{MUSCLE_LABELS[muscle]}</Badge>;
}
