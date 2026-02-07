import { create } from 'zustand';
import type { User } from 'domain/models';
import { loadFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS } from 'shared/utils/localStorage';

interface AuthStore {
  currentUser?: User;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  loadCurrentUser: (users: User[]) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: undefined,
  isAuthenticated: false,

  login: (user: User) => {
    saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    set({ currentUser: user, isAuthenticated: true });
  },

  logout: () => {
    removeFromStorage(STORAGE_KEYS.CURRENT_USER_ID);
    removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
    set({ currentUser: undefined, isAuthenticated: false });
  },

  updateCurrentUser: (updates: Partial<User>) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...updates } : undefined,
    }));
  },

  loadCurrentUser: (users: User[]) => {
    const userId = loadFromStorage<string | null>(STORAGE_KEYS.CURRENT_USER_ID, null);
    if (userId) {
      const user = users.find(u => u.id === userId);
      if (user) {
        set({ currentUser: user, isAuthenticated: true });
      }
    }
  },
}));
