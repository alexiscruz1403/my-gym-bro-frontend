'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useSessionStore from '@/store/session.store';
import {
  getActiveSession,
  logSet as logSetService,
  modifyExercise as modifyExerciseService,
  replaceExercise as replaceExerciseService,
  addExercises as addExercisesService,
  cancelSession as cancelSessionService,
  finishSession as finishSessionService,
} from '@/services/sessions.service';
import { queryClient } from '@/lib/query-client';
import type { WorkoutSession, FinishSessionResponse } from '@/types/domain.types';
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

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!activeSessionId) {
      setLoading(false);
      return;
    }
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

      const exercise = activeSession.exercises.find((ex) => ex.exerciseId === dto.exerciseId);
      if (exercise) {
        const existing = exercise.sets.filter((s) => s.setIndex !== dto.setIndex);
        const optimisticSet = {
          setIndex: dto.setIndex,
          reps: dto.reps,
          weight: dto.weight,
          duration: dto.duration,
          left: dto.left,
          right: dto.right,
          completed: dto.completed,
          loggedAt: new Date().toISOString(),
        };
        updateExerciseSets(dto.exerciseId, [...existing, optimisticSet]);
      }

      try {
        const response = await logSetService(activeSessionId, dto);
        updateExerciseSets(dto.exerciseId, response.sets);
      } catch {
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
      if (!activeSessionId || !activeSession) return;
      const exercise = activeSession.exercises.find((ex) => ex.exerciseId === exerciseId);
      updateExerciseConfig(exerciseId, { ...dto, modifiedDuringSession: true });
      try {
        await modifyExerciseService(activeSessionId, exerciseId, dto);
      } catch {
        if (exercise) updateExerciseConfig(exerciseId, exercise);
        throw new Error('Failed to modify exercise');
      }
    },
    [activeSessionId, activeSession, updateExerciseConfig],
  );

  const replaceExercise = useCallback(
    async (exerciseId: string, dto: ReplaceExerciseRequest) => {
      if (!activeSessionId) return;
      const updatedSession = await replaceExerciseService(activeSessionId, exerciseId, dto);
      setActiveSession(updatedSession);
    },
    [activeSessionId, setActiveSession],
  );

  const addExercises = useCallback(
    async (exerciseIds: string[]) => {
      if (!activeSessionId || !activeSession) return;
      const newExercises = await addExercisesService(activeSessionId, exerciseIds);
      setActiveSession({ ...activeSession, exercises: [...activeSession.exercises, ...newExercises] });
    },
    [activeSessionId, activeSession, setActiveSession],
  );

  const cancelSession = useCallback(async () => {
    await cancelSessionService();
    clearSession();
    router.replace('/dashboard');
  }, [clearSession, router]);

  const finishSession = useCallback(
    async (dto: FinishSessionRequest): Promise<FinishSessionResponse> => {
      if (!activeSessionId) throw new Error('No active session');
      const result = await finishSessionService(activeSessionId, dto);
      queryClient.invalidateQueries({ queryKey: ['session-history'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['exercise-history'] });
      queryClient.invalidateQueries({ queryKey: ['streaks', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['ranks'] });
      queryClient.invalidateQueries({ queryKey: ['plan', result.session.planId] });
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      queryClient.invalidateQueries({ queryKey: ['active-plan'] });
      return result;
    },
    [activeSessionId],
  );

  const resumeOrRedirect = useCallback(
    (session: WorkoutSession | null) => {
      if (session) {
        router.push('/session');
      }
    },
    [router],
  );

  const clearSessionData = useCallback(() => {
    clearSession();
  }, [clearSession]);

  return {
    session: activeSession,
    loading,
    error,
    logSet,
    modifyExercise,
    replaceExercise,
    addExercises,
    cancelSession,
    finishSession,
    resumeOrRedirect,
    clearSessionData,
  };
}
