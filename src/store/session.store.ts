import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WorkoutSession, SessionExercise, SessionSet } from '@/types/domain.types';
import type { RestTimerState, CountdownTimerState } from '@/types/ui.types';

// Persisted: activeSessionId + sessionStartTime + pendingSetInputs (survive app close)
// In-memory: activeSession + restTimer (re-fetched from server on resume)

export interface PendingSetInput {
  weight?: string;
  reps?: string;
  leftWeight?: string;
  leftReps?: string;
  rightWeight?: string;
  rightReps?: string;
}

interface SessionState {
  activeSessionId: string | null;
  sessionStartTime: number | null;
  activeSession: WorkoutSession | null;
  restTimer: RestTimerState | null;
  countdownTimer: CountdownTimerState | null;
  pendingSetInputs: Record<string, PendingSetInput>;
  _hasHydrated: boolean;
}

interface SessionActions {
  startSession: (sessionId: string) => void;
  endSession: () => void;
  setActiveSession: (session: WorkoutSession) => void;
  updateExerciseSets: (exerciseId: string, sets: SessionSet[]) => void;
  updateExerciseConfig: (exerciseId: string, config: Partial<SessionExercise>) => void;
  setRestTimer: (state: RestTimerState | null) => void;
  setCountdownTimer: (state: CountdownTimerState | null) => void;
  pauseCountdown: (secondsLeft: number) => void;
  resumeCountdown: (secondsLeft: number) => void;
  setPendingSetInput: (key: string, input: PendingSetInput) => void;
  clearPendingSetInput: (key: string) => void;
  clearAllPendingSetInputs: () => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set) => ({
      activeSessionId: null,
      sessionStartTime: null,
      activeSession: null,
      restTimer: null,
      countdownTimer: null,
      pendingSetInputs: {},
      _hasHydrated: false,

      startSession: (sessionId) =>
        set({ activeSessionId: sessionId, sessionStartTime: Date.now() }),

      endSession: () =>
        set({ activeSessionId: null, sessionStartTime: null }),

      setActiveSession: (session) =>
        set({ activeSession: session }),

      updateExerciseSets: (exerciseId, sets) =>
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              exercises: state.activeSession.exercises.map((ex) =>
                ex.exerciseId === exerciseId ? { ...ex, sets } : ex,
              ),
            },
          };
        }),

      updateExerciseConfig: (exerciseId, config) =>
        set((state) => {
          if (!state.activeSession) return state;
          return {
            activeSession: {
              ...state.activeSession,
              exercises: state.activeSession.exercises.map((ex) =>
                ex.exerciseId === exerciseId ? { ...ex, ...config } : ex,
              ),
            },
          };
        }),

      setPendingSetInput: (key, input) =>
        set((state) => ({
          pendingSetInputs: { ...state.pendingSetInputs, [key]: input },
        })),

      clearPendingSetInput: (key) =>
        set((state) => {
          const next = { ...state.pendingSetInputs };
          delete next[key];
          return { pendingSetInputs: next };
        }),

      clearAllPendingSetInputs: () => set({ pendingSetInputs: {} }),

      setRestTimer: (restTimer) => set({ restTimer }),

      setCountdownTimer: (countdownTimer) => set({ countdownTimer }),

      pauseCountdown: (secondsLeft) =>
        set((state) => {
          if (!state.countdownTimer) return state;
          return { countdownTimer: { ...state.countdownTimer, pausedSecondsLeft: secondsLeft } };
        }),

      resumeCountdown: (secondsLeft) =>
        set((state) => {
          if (!state.countdownTimer) return state;
          return {
            countdownTimer: {
              ...state.countdownTimer,
              durationSeconds: secondsLeft,
              startedAt: Date.now(),
              pausedSecondsLeft: null,
            },
          };
        }),

      clearSession: () =>
        set({
          activeSessionId: null,
          sessionStartTime: null,
          activeSession: null,
          restTimer: null,
          countdownTimer: null,
          pendingSetInputs: {},
        }),

      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: 'gym-planner-session',
      storage: createJSONStorage(() => localStorage),
      // Only persist session identity + draft inputs — not the full session object or timer
      partialize: (state) => ({
        activeSessionId: state.activeSessionId,
        sessionStartTime: state.sessionStartTime,
        pendingSetInputs: state.pendingSetInputs,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default useSessionStore;
