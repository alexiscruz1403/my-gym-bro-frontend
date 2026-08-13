import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  isDarkMode: boolean;
}

interface UIActions {
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const useUIStore = create<UIState & UIActions>()(
  persist(
    (set) => ({
      isDarkMode: true,

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),

      setDarkMode: (value) => set({ isDarkMode: value }),
    }),
    {
      name: 'my-gym-bro-ui',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUIStore;
