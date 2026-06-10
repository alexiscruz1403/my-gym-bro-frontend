import Dexie, { type EntityTable } from 'dexie';
import type {
  WorkoutPlan,
  Exercise,
  WorkoutSession,
  SessionHistoryItem,
  UserResponse,
  MuscleRankItem,
  VolumeByPeriodResponse,
  VolumeByMuscleResponse,
} from '@/types/domain.types';

// ─── Supplemental types stored in IndexedDB ───────────────────────

export type MutationType =
  | 'CREATE_PLAN'
  | 'UPDATE_PLAN'
  | 'DELETE_PLAN'
  | 'ACTIVATE_PLAN'
  | 'START_SESSION'
  | 'LOG_SET'
  | 'MODIFY_EXERCISE'
  | 'REPLACE_EXERCISE'
  | 'ADD_EXERCISES'
  | 'FINISH_SESSION'
  | 'CANCEL_SESSION'
  | 'SYNC_SESSION'
  | 'UPDATE_PROFILE'
  | 'UPDATE_PHYSICAL_DATA';

export interface QueuedMutation {
  id: string;
  type: MutationType;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  payload?: unknown;
  tempId?: string;
  timestamp: number;
  retries: number;
  status: 'pending' | 'syncing' | 'failed';
}

export interface IdMapping {
  tempId: string;
  realId: string;
}

export type CachedStatType = 'volume' | 'muscle';

export interface CachedStat {
  key: string; // `${type}_${period}_${date}`
  type: CachedStatType;
  data: VolumeByPeriodResponse | VolumeByMuscleResponse;
  cachedAt: number;
}

// ─── Database class ───────────────────────────────────────────────

class AppDatabase extends Dexie {
  plans!: EntityTable<WorkoutPlan, 'id'>;
  exercises!: EntityTable<Exercise, 'id'>;
  activeSession!: EntityTable<WorkoutSession, '_id'>;
  sessionHistory!: EntityTable<SessionHistoryItem, '_id'>;
  sessionDetails!: EntityTable<WorkoutSession, '_id'>;
  userProfile!: EntityTable<UserResponse, 'id'>;
  statsCache!: EntityTable<CachedStat, 'key'>;
  muscleRanks!: EntityTable<MuscleRankItem, 'muscle'>;
  mutationQueue!: EntityTable<QueuedMutation, 'id'>;
  idMap!: EntityTable<IdMapping, 'tempId'>;

  constructor() {
    super('gym-planner-offline');
    this.version(1).stores({
      plans: 'id, isActive, isAiGenerated',
      exercises: 'id, loadType, trackingType',
      activeSession: '_id',
      sessionHistory: '_id, startedAt, status',
      sessionDetails: '_id',
      userProfile: 'id',
      statsCache: 'key, cachedAt',
      muscleRanks: 'muscle',
      mutationQueue: 'id, status, timestamp',
      idMap: 'tempId',
    });
  }
}

export const db = new AppDatabase();
