import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Sprint 3 — persists activeSessionId so the user can resume a
// workout if the app is closed accidentally during a session.

interface SessionState {
  activeSessionId: string | null;
  sessionStartTime: number | null;
}

interface SessionActions {
  startSession: (sessionId: string) => void;
  endSession: () => void;
}

const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set) => ({
      activeSessionId: null,
      sessionStartTime: null,

      startSession: (sessionId) =>
        set({ activeSessionId: sessionId, sessionStartTime: Date.now() }),

      endSession: () =>
        set({ activeSessionId: null, sessionStartTime: null }),
    }),
    {
      name: 'gym-planner-session',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSessionStore;
