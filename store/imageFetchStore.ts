import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SearchedImage } from '@/interfaces/api/imageApiResults';
import { zustandStorage } from '@/services/clients/mmkv';

export interface ImageFetchState {
  imageFetchLink: SearchedImage | null;
  setImageFetchLink: (imageFetchLink: SearchedImage | null) => void;
  imageRefreshCounter: number;
  changeImageRefreshCounter: (changeType: 'increase' | 'reset') => void;
}

const useImageFetchStore = create<ImageFetchState>()(
  persist(
    (set, get) => ({
      imageFetchLink: null,
      setImageFetchLink: (imageFetchLink: SearchedImage | null) =>
        set((state) => ({ ...state, imageFetchLink })),
      imageRefreshCounter: 0,
      changeImageRefreshCounter: (changeType: 'increase' | 'reset') =>
        set((state) => {
          if (changeType === 'increase') {
            return {
              ...state,
              imageRefreshCounter: state.imageRefreshCounter + 1,
            };
          } else {
            return {
              ...state,
              imageRefreshCounter: 0,
            };
          }
        }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useImageFetchStore;
