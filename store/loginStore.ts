import { create } from 'zustand';

export interface LoginState {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  passwordIcon: boolean;
  setPasswordIcon: (passwordIcon: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useLoginStore = create<LoginState>()((set) => ({
  email: '',
  setEmail: (email: string) => set((state) => ({ ...state, email })),
  password: '',
  setPassword: (password: string) => set((state) => ({ ...state, password })),
  passwordIcon: true,
  setPasswordIcon: (passwordIcon: boolean) => set((state) => ({ ...state, passwordIcon })),
  loading: false,
  setLoading: (loading: boolean) => set((state) => ({ ...state, loading })),
}));

export default useLoginStore;
