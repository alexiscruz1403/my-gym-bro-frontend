import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';
import { db } from '@/lib/db';
import { enqueue, dequeueBySessionTempId, type MutationType } from '@/lib/offline-queue';
import { isTempId, TEMP_ID_PREFIX } from '@/lib/id-reconciler';
import type { WorkoutSession, SessionExercise, SessionSet, FinishSessionResponse } from '@/types/domain.types';
import type {
  StartSessionRequest,
  LogSetRequest,
  LogSetResponse,
  ModifyExerciseRequest,
  ReplaceExerciseRequest,
  FinishSessionRequest,
} from '@/types/api.types';

function isNetworkError(error: unknown): boolean {
  return !navigator.onLine || (axios.isAxiosError(error) && !error.response);
}

// Build a local WorkoutSession from plan data when offline
async function buildLocalSession(
  dto: StartSessionRequest,
  tempId: string,
): Promise<WorkoutSession> {
  const plan = dto.planId ? await db.plans.get(dto.planId) : null;
  const day = plan?.days.find((d) => d.dayOfWeek === dto.dayOfWeek);

  const exercises: SessionExercise[] = [];
  if (day) {
    for (let i = 0; i < day.exercises.length; i++) {
      const config = day.exercises[i];
      const exercise = await db.exercises.get(config.exerciseId);
      exercises.push({
        exerciseId: config.exerciseId,
        exerciseName: config.exerciseName,
        orderIndex: i,
        supersetGroupId: config.supersetGroupId,
        weightUnit: config.weightUnit,
        plannedSets: config.sets,
        plannedReps: config.reps,
        plannedDuration: config.duration,
        plannedWeight: config.weight,
        plannedRest: config.rest,
        trackingType: exercise?.trackingType ?? 'reps',
        sets: [],
        modifiedDuringSession: false,
        lastPerformance: null,
        bilateral: config.bilateral ?? exercise?.bilateral ?? false,
        plannedLeft: config.left ?? null,
        plannedRight: config.right ?? null,
        gifUrl: config.gifUrl ?? exercise?.gifUrl ?? null,
      });
    }
  }

  return {
    _id: tempId,
    planId: dto.planId ?? '',
    planName: plan?.name ?? '',
    dayOfWeek: dto.dayOfWeek,
    dayName: day?.dayName ?? null,
    status: 'in_progress',
    startedAt: new Date().toISOString(),
    exercises,
  };
}

export async function startSession(dto: StartSessionRequest): Promise<WorkoutSession> {
  if (!navigator.onLine) {
    const tempId = `${TEMP_ID_PREFIX}session_${uuid()}`;
    const session = await buildLocalSession(dto, tempId);
    await db.activeSession.put(session);
    await enqueue({
      type: 'START_SESSION' as MutationType,
      method: 'POST',
      url: API_ROUTES.sessions.start,
      payload: dto,
      tempId,
    });
    return session;
  }
  const { data } = await apiClient.post<WorkoutSession>(API_ROUTES.sessions.start, dto);
  await db.activeSession.put(data);
  return data;
}

export async function getActiveSession(): Promise<WorkoutSession | null> {
  try {
    const { data } = await apiClient.get<WorkoutSession>(API_ROUTES.sessions.active);
    await db.activeSession.put(data);
    return data;
  } catch (error: unknown) {
    const status =
      typeof error === 'object' &&
      error !== null &&
      'response' in error
        ? (error as { response: { status: number } }).response?.status
        : null;

    if (status === 404) return null;

    if (isNetworkError(error)) {
      const cached = await db.activeSession.toCollection().first();
      return cached ?? null;
    }
    throw error;
  }
}

export async function logSet(sessionId: string, dto: LogSetRequest): Promise<LogSetResponse> {
  if (!navigator.onLine) {
    const session = await db.activeSession.get(sessionId);
    if (!session) throw new Error('Active session not found in offline cache');

    const newSet: SessionSet = {
      setIndex: dto.setIndex,
      reps: dto.reps,
      duration: dto.duration,
      weight: dto.weight,
      completed: dto.completed,
      loggedAt: new Date().toISOString(),
      left: dto.left ?? null,
      right: dto.right ?? null,
    };

    const updatedExercises = session.exercises.map((ex) => {
      if (ex.exerciseId !== dto.exerciseId) return ex;
      const sets = [...ex.sets];
      const existing = sets.findIndex((s) => s.setIndex === dto.setIndex);
      if (existing >= 0) {
        sets[existing] = newSet;
      } else {
        sets.push(newSet);
      }
      return { ...ex, sets };
    });

    await db.activeSession.put({ ...session, exercises: updatedExercises });

    await enqueue({
      type: 'LOG_SET' as MutationType,
      method: 'POST',
      url: API_ROUTES.sessions.logSet(sessionId),
      payload: dto,
    });

    return {
      exerciseId: dto.exerciseId,
      sets: updatedExercises.find((ex) => ex.exerciseId === dto.exerciseId)?.sets ?? [],
    };
  }
  const { data } = await apiClient.post<LogSetResponse>(
    API_ROUTES.sessions.logSet(sessionId),
    dto,
  );
  return data;
}

export async function modifyExercise(
  sessionId: string,
  exerciseId: string,
  dto: ModifyExerciseRequest,
): Promise<void> {
  if (!navigator.onLine) {
    const session = await db.activeSession.get(sessionId);
    if (!session) throw new Error('Active session not found in offline cache');

    const updatedExercises = session.exercises.map((ex) =>
      ex.exerciseId === exerciseId
        ? {
            ...ex,
            plannedSets: dto.plannedSets ?? ex.plannedSets,
            plannedReps: dto.plannedReps ?? ex.plannedReps,
            plannedDuration: dto.plannedDuration ?? ex.plannedDuration,
            plannedWeight: dto.plannedWeight ?? ex.plannedWeight,
            plannedRest: dto.plannedRest ?? ex.plannedRest,
            weightUnit: dto.weightUnit ?? ex.weightUnit,
            modifiedDuringSession: true,
          }
        : ex,
    );
    await db.activeSession.put({ ...session, exercises: updatedExercises });

    await enqueue({
      type: 'MODIFY_EXERCISE' as MutationType,
      method: 'PATCH',
      url: API_ROUTES.sessions.modifyExercise(sessionId, exerciseId),
      payload: dto,
    });
    return;
  }
  await apiClient.patch(API_ROUTES.sessions.modifyExercise(sessionId, exerciseId), dto);
}

export async function replaceExercise(
  sessionId: string,
  exerciseId: string,
  dto: ReplaceExerciseRequest,
): Promise<WorkoutSession> {
  if (!navigator.onLine) {
    const session = await db.activeSession.get(sessionId);
    if (!session) throw new Error('Active session not found in offline cache');

    const newExercise = await db.exercises.get(dto.newExerciseId);

    const updatedExercises = session.exercises.map((ex) =>
      ex.exerciseId === exerciseId
        ? {
            ...ex,
            exerciseId: dto.newExerciseId,
            exerciseName: newExercise?.name ?? dto.newExerciseId,
            sets: [],
            modifiedDuringSession: true,
            lastPerformance: null,
            bilateral: newExercise?.bilateral ?? ex.bilateral,
            trackingType: newExercise?.trackingType ?? ex.trackingType,
            gifUrl: newExercise?.gifUrl ?? null,
            plannedSets: dto.plannedSets ?? ex.plannedSets,
            plannedReps: dto.plannedReps ?? ex.plannedReps,
            plannedDuration: dto.plannedDuration ?? ex.plannedDuration,
            plannedWeight: dto.plannedWeight ?? ex.plannedWeight,
            plannedRest: dto.plannedRest ?? ex.plannedRest,
            weightUnit: dto.weightUnit ?? ex.weightUnit,
          }
        : ex,
    );

    const updated = { ...session, exercises: updatedExercises };
    await db.activeSession.put(updated);

    await enqueue({
      type: 'REPLACE_EXERCISE' as MutationType,
      method: 'PUT',
      url: API_ROUTES.sessions.replaceExercise(sessionId, exerciseId),
      payload: dto,
    });
    return updated;
  }
  await apiClient.put(API_ROUTES.sessions.replaceExercise(sessionId, exerciseId), dto);
  const { data } = await apiClient.get<WorkoutSession>(API_ROUTES.sessions.active);
  await db.activeSession.put(data);
  return data;
}

export async function cancelSession(): Promise<void> {
  const session = await db.activeSession.toCollection().first();

  if (!navigator.onLine) {
    await db.activeSession.clear();
    // Only queue cancel if the session was already created on the server
    if (session && !isTempId(session._id)) {
      await enqueue({
        type: 'CANCEL_SESSION' as MutationType,
        method: 'DELETE',
        url: API_ROUTES.sessions.cancel,
      });
    }
    return;
  }
  await apiClient.delete(API_ROUTES.sessions.cancel);
  await db.activeSession.clear();
}

export async function finishSession(
  sessionId: string,
  dto: FinishSessionRequest,
): Promise<FinishSessionResponse> {
  if (!navigator.onLine) {
    const session = await db.activeSession.get(sessionId);
    if (!session) throw new Error('Active session not found in offline cache');

    const finishedAt = new Date().toISOString();
    const finished = { ...session, status: dto.status, finishedAt } as WorkoutSession;

    if (isTempId(sessionId)) {
      // Session was started offline — consolidate into a single bulk sync request.
      // Remove the preceding START_SESSION + LOG_SET×N + MODIFY/REPLACE mutations.
      await dequeueBySessionTempId(sessionId);

      const syncPayload = {
        dayOfWeek: session.dayOfWeek,
        planId: session.planId || undefined,
        startedAt: session.startedAt,
        exercises: session.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets.map((s) => ({
            setIndex: s.setIndex,
            reps: s.reps,
            duration: s.duration,
            weight: s.weight,
            completed: s.completed,
            loggedAt: s.loggedAt,
            left: s.left ?? undefined,
            right: s.right ?? undefined,
          })),
        })),
        status: dto.status,
        finishedAt,
      };

      await enqueue({
        type: 'SYNC_SESSION' as MutationType,
        method: 'POST',
        url: API_ROUTES.sessions.sync,
        payload: syncPayload,
      });
    } else {
      // Session was started online — keep the simple FINISH_SESSION mutation.
      await enqueue({
        type: 'FINISH_SESSION' as MutationType,
        method: 'PATCH',
        url: API_ROUTES.sessions.finish(sessionId),
        payload: dto,
      });
    }

    await db.activeSession.clear();
    return { session: finished, rankSummary: [] };
  }
  const { data } = await apiClient.patch<FinishSessionResponse>(
    API_ROUTES.sessions.finish(sessionId),
    dto,
  );
  await db.activeSession.clear();
  return data;
}
