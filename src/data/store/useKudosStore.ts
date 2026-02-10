import { create } from 'zustand';
import type { Kudo } from 'domain/models';

interface KudosStore {
  kudos: Kudo[];
  loading: boolean;
  error?: string;
  setKudos: (kudos: Kudo[]) => void;
  addKudo: (kudo: Kudo) => void;
  updateKudo: (kudoId: string, updates: Partial<Kudo>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

export const useKudosStore = create<KudosStore>((set) => ({
  kudos: [],
  loading: false,
  error: undefined,

  setKudos: (kudos: Kudo[]) => {
    set({ kudos, loading: false, error: undefined });
  },

  addKudo: (kudo: Kudo) => {
    set((state) => ({
      kudos: [kudo, ...state.kudos],
    }));
  },

  updateKudo: (kudoId: string, updates: Partial<Kudo>) => {
    set((state) => ({
      kudos: state.kudos.map(k => 
        k.id === kudoId ? { ...k, ...updates } : k
      ),
    }));
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error?: string) => {
    set({ error, loading: false });
  },
}));
