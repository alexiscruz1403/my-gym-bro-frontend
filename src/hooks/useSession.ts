'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useSessionStore from '@/store/session.store';
import {
  getActiveSession,
  logSet as logSetService,
  modifyExercise as modifyExerciseService,
  replaceExercise as replaceExerciseService,
  cancelSession as cancelSessionService,
  finishSession as finishSessionService,
} from '@/services/sessions.service';
import type { WorkoutSession, SessionSummary } from '@/types/domain.types';
import type { LogSetRequest, ModifyExerciseRequest, ReplaceExerciseRequest, FinishSessionRequest } from '@/types/api.types';

export function useSession() {
  const router = useRouter();
  const {
    activeSessionId,
    activeSession,
    _hasHydrated,
    setActiveSession,
    updateExerciseSets,
    updateExerciseConfig,
    clearSession,
  } = useSessionStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wait for Zustand to rehydrate from localStorage before deciding loading state.
  // Without this, activeSessionId is null on the first render (before persist kicks in),
  // causing loading to be set to false immediately — triggering the redirect to /dashboard.
  useEffect(() => {
    if (!_hasHydrated) return;

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
  }, [_hasHydrated, activeSessionId]);

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

  const replaceExercise = useCallback(
    async (exerciseId: string, dto: ReplaceExerciseRequest) => {
      if (!activeSessionId) return;
      const updatedSession = await replaceExerciseService(activeSessionId, exerciseId, dto);
      setActiveSession(updatedSession);
    },
    [activeSessionId, setActiveSession],
  );

  const cancelSession = useCallback(async () => {
    await cancelSessionService();
    clearSession();
    router.replace('/dashboard');
  }, [clearSession, router]);

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
    replaceExercise,
    cancelSession,
    finishSession,
    resumeOrRedirect,
  };
}
