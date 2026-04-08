import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserResponse } from '@/types/domain.types';

// ─── State & Actions types ────────────────────────────────────────

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuthenticated: (authenticated: boolean) => void;
  setUser: (user: UserResponse) => void;
  logout: () => void;
  initialize: () => void;
}

// ─── Store ────────────────────────────────────────────────────────
// Tokens are stored in httpOnly cookies managed by the backend.
// The store only tracks whether the user is authenticated and their profile.

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setAuthenticated: (authenticated) =>
        set({ isAuthenticated: authenticated, isLoading: false }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      initialize: () => set({ isLoading: false }),
    }),
    {
      name: 'gym-planner-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist isAuthenticated — user data is always re-fetched from the API
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    },
  ),
);

// ─── Standalone selectors for axios interceptors ──────────────────

export function logout(): void {
  useAuthStore.getState().logout();
}

export default useAuthStore;
