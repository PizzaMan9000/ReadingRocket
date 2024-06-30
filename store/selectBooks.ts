import { create } from 'zustand';

export interface SelectBooksState {
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
}

const useSelectBooksState = create<SelectBooksState>()((set) => ({
  searchValue: '',
  setSearchValue: (searchValue: string) => set((state) => ({ ...state, searchValue })),
}));

export default useSelectBooksState;
