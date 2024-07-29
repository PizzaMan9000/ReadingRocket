import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { IDBook } from '@/interfaces/api/bookidApiResult';
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
  books: IDBook[];
  setBooks: (books: IDBook[]) => void;
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
      books: [],
      setBooks: (books: IDBook[]) => set((state) => ({ ...state, books })),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default useBooksStore;
