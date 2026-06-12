import { create } from 'zustand';
import type { AchievementUnlockedPayload } from '@/types/domain.types';

interface AchievementAnimationStore {
  queue: AchievementUnlockedPayload[];
  enqueue: (p: AchievementUnlockedPayload) => void;
  dequeue: () => void;
}

export const useAchievementAnimationStore = create<AchievementAnimationStore>((set) => ({
  queue: [],
  enqueue: (p) => set((s) => ({ queue: [...s.queue, p] })),
  dequeue: () => set((s) => ({ queue: s.queue.slice(1) })),
}));
