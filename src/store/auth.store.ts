import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserResponse } from '@/types/domain.types';


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


const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

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
      name: 'my-gym-bro-auth',
      storage: createJSONStorage(() => localStorage),
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


export function logout(): void {
  useAuthStore.getState().logout();
}

export function setAuthenticated(value: boolean): void {
  useAuthStore.getState().setAuthenticated(value);
}

export default useAuthStore;
