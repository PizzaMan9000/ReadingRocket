import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/services/clients/mmkv';

export interface ProgressState {
  dailyPagesRead: number;
  setDailyPagesRead: (dailyPagesRead: number) => void;
  readingGoals: number;
  setReadingGoals: (readingGoals: number) => void;
  completed: boolean;
  setCompleted: (completed: boolean) => void;
}

const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      dailyPagesRead: 0,
      setDailyPagesRead: (dailyPagesRead: number) =>
        set((state) => {
          console.log('JAJAJAJAJA', dailyPagesRead);
          return { ...state, dailyPagesRead };
        }),
      readingGoals: 0,
      setReadingGoals: (readingGoals: number) =>
        set((state) => {
          console.log('JAJAJAJAJA', readingGoals);
          return { ...state, readingGoals };
        }),
      completed: false,
      setCompleted: (completed: boolean) => set((state) => ({ ...state, completed })),
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useProgressStore;
