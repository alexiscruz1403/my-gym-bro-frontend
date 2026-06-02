import type { ExerciseSide } from '@/types/domain.types';

export function isUnilateral(ex: { bilateral?: boolean } | null | undefined): boolean {
  return ex?.bilateral === false;
}

interface SingularLike {
  reps?: number;
  duration?: number;
  durationSeconds?: number;
  weight?: number;
  weightKg?: number;
}

function formatMetricAndWeight(
  reps: number | undefined,
  duration: number | undefined,
  weight: number | undefined,
  weightUnit: 'kg' | 'lbs',
): string {
  const parts: string[] = [];
  if (typeof reps === 'number') {
    parts.push(`${reps} reps`);
  } else if (typeof duration === 'number') {
    parts.push(`${duration}s`);
  }
  if (typeof weight === 'number' && weight > 0) {
    parts.push(`${weight} ${weightUnit}`);
  }
  return parts.length > 0 ? parts.join(' · ') : '—';
}

export function formatSide(
  side: ExerciseSide | null | undefined,
  weightUnit: 'kg' | 'lbs',
): string {
  if (!side) return '—';
  // Plan config sides use minReps/maxReps; session/logged sides use reps
  if (side.minReps !== undefined) {
    const repsStr =
      side.maxReps !== undefined
        ? `${side.minReps}-${side.maxReps} reps`
        : `${side.minReps} reps`;
    const parts = [repsStr];
    if (side.weight !== undefined && side.weight > 0) parts.push(`${side.weight} ${weightUnit}`);
    return parts.join(' · ');
  }
  return formatMetricAndWeight(side.reps, side.duration, side.weight, weightUnit);
}

export function formatSingular(
  set: SingularLike | null | undefined,
  weightUnit: 'kg' | 'lbs',
): string {
  if (!set) return '—';
  const duration = set.duration ?? set.durationSeconds;
  const weight = set.weight ?? set.weightKg;
  return formatMetricAndWeight(set.reps, duration, weight, weightUnit);
}
