import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '@/services/clients/mmkv';

export interface GlobalState {
  notificationsOn: boolean;
  setNotificationsOn: (notificationsOn: boolean) => void;
}

const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      notificationsOn: true,
      setNotificationsOn: (notificationsOn: boolean) =>
        set((state) => ({ ...state, notificationsOn })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useGlobalStore;
