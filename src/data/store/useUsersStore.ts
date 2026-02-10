import { create } from 'zustand';
import type { User } from 'domain/models';

interface UsersStore {
  users: User[];
  loading: boolean;
  setUsers: (users: User[]) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
  users: [],
  loading: false,

  setUsers: (users: User[]) => {
    set({ users, loading: false });
  },

  updateUser: (userId: string, updates: Partial<User>) => {
    set((state) => ({
      users: state.users.map(u => 
        u.id === userId ? { ...u, ...updates } : u
      ),
    }));
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },
}));
