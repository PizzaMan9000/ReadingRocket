import { create } from 'zustand';

import { Item } from '@/interfaces/api/bookApiResults';

export interface SelectBooksState {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  startIndex: number;
  setStartIndex: (startIndex: number) => void;
  searchedValue: Item[];
  setSearchedValue: (searchedValue: Item[]) => void;
}

const useSelectBooksState = create<SelectBooksState>()((set) => ({
  searchValue: '',
  setSearchValue: (searchValue: string) => set((state) => ({ ...state, searchValue })),
  startIndex: 0,
  setStartIndex: (startIndex: number) => set((state) => ({ ...state, startIndex })),
  searchedValue: [],
  setSearchedValue: (searchedValue: Item[]) => set((state) => ({ ...state, searchedValue })),
}));

export default useSelectBooksState;
