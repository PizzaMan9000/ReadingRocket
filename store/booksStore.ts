import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { dataSaved } from '@/interfaces/app/forumInterface';
import { zustandStorage } from '@/services/clients/mmkv';

interface BookIdsPageProps {
  id: string;
  pageCount: number | undefined;
  pagesRead: number;
}

export interface BooksState {
  selectedBooks: dataSaved[];
  setSelectedBooks: (selectedBooks: dataSaved[]) => void;
  bookIdsPage: BookIdsPageProps[];
  setBookIdsPage: (bookIdsPage: BookIdsPageProps[]) => void;
}

const useBooksStore = create<BooksState>()(
  persist(
    (set, get) => ({
      selectedBooks: [],
      setSelectedBooks: (selectedBooks: dataSaved[]) => {
        set((state) => {
          const allPagesId = selectedBooks.map((item) => ({
            id: item.id,
            pageCount: item.pageCount,
            pagesRead: 0,
          }));
          return {
            ...state,
            selectedBooks,
            bookIdsPage: allPagesId,
          };
        });
      },
      bookIdsPage: [],
      setBookIdsPage: (bookIdsPage: BookIdsPageProps[]) =>
        set((state) => ({ ...state, bookIdsPage })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useBooksStore;
