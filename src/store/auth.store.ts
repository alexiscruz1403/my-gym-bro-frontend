import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserResponse } from '@/types/domain.types';

// ─── State & Actions types ────────────────────────────────────────

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: UserResponse) => void;
  logout: () => void;
  initialize: () => void;
}

// ─── Cookie helpers ───────────────────────────────────────────────
// The accessToken is also written to a non-httpOnly cookie so that
// Next.js middleware (Edge Runtime, no localStorage access) can read
// it for route protection decisions.

const ACCESS_TOKEN_COOKIE = 'gym-planner-access-token';
const COOKIE_MAX_AGE = 15 * 60; // 15 minutes — same TTL as the JWT

function writeAccessTokenCookie(token: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=strict`;
}

function clearAccessTokenCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0; samesite=strict`;
}

// ─── Store ────────────────────────────────────────────────────────

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      setTokens: ({ accessToken, refreshToken }) => {
        writeAccessTokenCookie(accessToken);
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        clearAccessTokenCookie();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      initialize: () => {
        const { accessToken } = get();
        if (accessToken) {
          writeAccessTokenCookie(accessToken);
          set({ isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'gym-planner-auth',
      storage: createJSONStorage(() => localStorage),
      // Persist only tokens — user data is always re-fetched from the API
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, sync cookie and mark loading as done
        if (state) {
          if (state.accessToken) {
            writeAccessTokenCookie(state.accessToken);
            state.isAuthenticated = true;
          }
          state.isLoading = false;
        }
      },
    },
  ),
);

// ─── Standalone selectors for axios interceptors ──────────────────
// These avoid a circular import: axios.ts imports these functions
// directly instead of importing the full store hook.

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export function getRefreshToken(): string | null {
  return useAuthStore.getState().refreshToken;
}

export function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): void {
  useAuthStore.getState().setTokens(tokens);
}

export function logout(): void {
  useAuthStore.getState().logout();
}

export default useAuthStore;
