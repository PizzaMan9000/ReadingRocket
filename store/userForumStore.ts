import { create } from 'zustand';

export interface UserForumState {
  name: string;
  setName: (name: string) => void;
  profession: 'job' | 'student';
  setProfession: (profession: 'job' | 'student') => void;
  readingCategory: 'fiction' | 'nonfiction' | 'both';
  setReadingCategory: (readingCategory: 'fiction' | 'nonfiction' | 'both') => void;
  typeOfReader: string;
  setTypeOfReader: (typeOfReader: string) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
}

const useUserForumStore = create<UserForumState>()((set) => ({
  name: '',
  setName: (name: string) => set((state) => ({ ...state, name })),
  profession: 'student',
  setProfession: (profession: 'job' | 'student') => set((state) => ({ ...state, profession })),
  readingCategory: 'fiction',
  setReadingCategory: (readingCategory: 'fiction' | 'nonfiction' | 'both') =>
    set((state) => ({ ...state, readingCategory })),
  typeOfReader: 'frequent_reader',
  setTypeOfReader: (typeOfReader: string) => set((state) => ({ ...state, typeOfReader })),
  errorMessage: '',
  setErrorMessage: (errorMessage: string) => set((state) => ({ ...state, errorMessage })),
}));

export default useUserForumStore;
