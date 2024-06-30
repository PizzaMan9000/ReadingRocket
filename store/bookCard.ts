import { create } from 'zustand';

export interface BookCardState {
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

const useBookCardStore = create<BookCardState>()((set) => ({
  checked: false,
  setChecked: (checked: boolean) => set((state) => ({ ...state, checked })),
}));

export default useBookCardStore;
