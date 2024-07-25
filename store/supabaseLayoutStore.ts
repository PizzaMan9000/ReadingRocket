import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

export interface SupabaseLayoutState {
  session: Session | null;
  setSession: (session: Session) => void;
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
}

const SupabaseLayoutStore = create<SupabaseLayoutState>()((set) => ({
  session: null,
  setSession: (session: Session) => set((state) => ({ ...state, session })),
  initialized: false,
  setInitialized: (initialized: boolean) => set((state) => ({ ...state, initialized })),
}));

export default SupabaseLayoutStore;
