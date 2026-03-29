'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useSessionStore from '@/store/session.store';
import {
  getActiveSession,
  logSet as logSetService,
  modifyExercise as modifyExerciseService,
  finishSession as finishSessionService,
} from '@/services/sessions.service';
import type { WorkoutSession, SessionSummary } from '@/types/domain.types';
import type { LogSetRequest, ModifyExerciseRequest, FinishSessionRequest } from '@/types/api.types';

export function useSession() {
  const router = useRouter();
  const {
    activeSessionId,
    activeSession,
    setActiveSession,
    updateExerciseSets,
    updateExerciseConfig,
    clearSession,
  } = useSessionStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount: if we have a persisted sessionId, hydrate from the server
  useEffect(() => {
    if (!activeSessionId) {
      setLoading(false);
      return;
    }
    // Already hydrated in this session — no need to refetch
    if (activeSession) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const session = await getActiveSession();
        if (cancelled) return;
        if (session) {
          setActiveSession(session);
        } else {
          // Session no longer active on server — clean up local state
          clearSession();
        }
      } catch {
        if (!cancelled) setError('Failed to load session');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId]);

  const logSet = useCallback(
    async (dto: LogSetRequest) => {
      if (!activeSessionId || !activeSession) return;

      // Optimistic update
      const exercise = activeSession.exercises.find((ex) => ex.exerciseId === dto.exerciseId);
      if (exercise) {
        const existing = exercise.sets.filter((s) => s.setIndex !== dto.setIndex);
        const optimisticSet = {
          setIndex: dto.setIndex,
          reps: dto.reps,
          weight: dto.weight,
          completed: dto.completed,
          loggedAt: new Date().toISOString(),
        };
        updateExerciseSets(dto.exerciseId, [...existing, optimisticSet]);
      }

      try {
        const response = await logSetService(activeSessionId, dto);
        updateExerciseSets(dto.exerciseId, response.sets);
      } catch {
        // Revert optimistic update on failure
        if (exercise) {
          updateExerciseSets(dto.exerciseId, exercise.sets);
        }
        throw new Error('Failed to log set');
      }
    },
    [activeSessionId, activeSession, updateExerciseSets],
  );

  const modifyExercise = useCallback(
    async (exerciseId: string, dto: ModifyExerciseRequest) => {
      if (!activeSessionId) return;
      await modifyExerciseService(activeSessionId, exerciseId, dto);
      updateExerciseConfig(exerciseId, {
        ...dto,
        modifiedDuringSession: true,
      });
    },
    [activeSessionId, updateExerciseConfig],
  );

  const finishSession = useCallback(
    async (dto: FinishSessionRequest): Promise<SessionSummary> => {
      if (!activeSessionId) throw new Error('No active session');
      const summary = await finishSessionService(activeSessionId, dto);
      clearSession();
      return summary;
    },
    [activeSessionId, clearSession],
  );

  const resumeOrRedirect = useCallback(
    (session: WorkoutSession | null) => {
      if (session) {
        router.push('/session');
      }
    },
    [router],
  );

  return {
    session: activeSession,
    loading,
    error,
    logSet,
    modifyExercise,
    finishSession,
    resumeOrRedirect,
  };
}
