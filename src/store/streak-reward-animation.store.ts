import { create } from 'zustand';
import type { StreakRewardUnlockedPayload } from '@/types/domain.types';

interface StreakRewardAnimationStore {
  queue: StreakRewardUnlockedPayload[];
  enqueue: (p: StreakRewardUnlockedPayload) => void;
  dequeue: () => void;
}

export const useStreakRewardAnimationStore = create<StreakRewardAnimationStore>((set) => ({
  queue: [],
  enqueue: (p) => set((s) => ({ queue: [...s.queue, p] })),
  dequeue: () => set((s) => ({ queue: s.queue.slice(1) })),
}));
