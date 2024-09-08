import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/services/clients/mmkv';
import { IDBook } from '@/interfaces/api/bookidApiResult';

export interface GlobalState {
  notificationsOn: boolean;
  setNotificationsOn: (notificationsOn: boolean) => void;
  selectedBook: IDBook | null;
  setSelectedBook: (selectedBook: IDBook) => void;
}

const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      notificationsOn: true,
      setNotificationsOn: (notificationsOn: boolean) =>
        set((state) => ({ ...state, notificationsOn })),
      selectedBook: null,
      setSelectedBook: (selectedBook: IDBook) => set((state) => ({ ...state, selectedBook })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useGlobalStore;
