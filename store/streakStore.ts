import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/services/clients/mmkv';

export interface StreakState {
  userJoinDay: number;
  setUserJoinDay: (userJoinDay: number) => void;
  streakDaysCount: number | null;
  setStreakDaysCount: (streakDaysCount: number) => void;
}

const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      userJoinDay: new Date().getDay(),
      setUserJoinDay: (userJoinDay: number) => set((state) => ({ ...state, userJoinDay })),
      streakDaysCount: null,
      setStreakDaysCount: (streakDaysCount: number) =>
        set((state) => ({ ...state, streakDaysCount })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useStreakStore;
