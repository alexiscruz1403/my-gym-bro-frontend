import type { MuscleGroup } from './domain.types';

export type RecoveryStatus = 'FRESH' | 'RECOVERED' | 'FATIGUED';

export interface MuscleRecoveryItem {
  muscle: MuscleGroup;
  status: RecoveryStatus;
  recoveryPercent: number;
  hoursUntilFresh: number;
  lastTrainedAt: string | null;
}

export type RecoveryMap = Map<MuscleGroup, MuscleRecoveryItem>;
