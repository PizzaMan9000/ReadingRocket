import { create } from 'zustand';

interface GlobalBookCardStoreState {
  bookIds: string[];
}

const useGlobalBookCardStore = create<GlobalBookCardStoreState>()((set) => ({
  bookIds: [],
}));

export default useGlobalBookCardStore;