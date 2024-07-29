import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/services/clients/mmkv';

export interface ProgressState {
  dailyPagesRead: number;
  setDailyPagesRead: (dailyPagesRead: number) => void;
  readingGoals: number;
  setReadingGoals: (readingGoals: number) => void;
}

const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      dailyPagesRead: 0,
      setDailyPagesRead: (dailyPagesRead: number) => set((state) => ({ ...state, dailyPagesRead })),
      readingGoals: 0,
      setReadingGoals: (readingGoals: number) => set((state) => ({ ...state, readingGoals })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useProgressStore;
