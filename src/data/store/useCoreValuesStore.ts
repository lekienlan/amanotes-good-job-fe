import { create } from 'zustand';
import type { CoreValue } from 'domain/models';

interface CoreValuesStore {
  coreValues: CoreValue[];
  loading: boolean;
  error?: string;
  setCoreValues: (coreValues: CoreValue[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

export const useCoreValuesStore = create<CoreValuesStore>((set) => ({
  coreValues: [],
  loading: false,
  error: undefined,

  setCoreValues: (coreValues: CoreValue[]) => {
    set({ coreValues, loading: false, error: undefined });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error?: string) => {
    set({ error, loading: false });
  }
}));
