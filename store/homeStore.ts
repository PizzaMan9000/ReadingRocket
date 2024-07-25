import { create } from 'zustand';

import { IDBook } from '@/interfaces/api/bookidApiResult';

interface HomeState {
  books: IDBook[];
}

const useHomeStore = create<HomeState>()((set) => ({
  books: [],
}));

export default useHomeStore;
