import { create } from 'zustand';
import type { User } from 'domain/models';
import { loadFromStorage, saveToStorage, removeFromStorage, STORAGE_KEYS } from 'shared/utils/localStorage';

interface AuthStore {
  currentUser?: User;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  login: (user: User) => void;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  loadCurrentUser: (users: User[]) => void;
}

const getInitialTokens = () => ({
  accessToken: loadFromStorage<string | null>(STORAGE_KEYS.ACCESS_TOKEN, null),
  refreshToken: loadFromStorage<string | null>(STORAGE_KEYS.REFRESH_TOKEN, null),
});

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: undefined,
  isAuthenticated: false,
  ...getInitialTokens(),

  setTokens: (accessToken: string, refreshToken: string) => {
    saveToStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    saveToStorage(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    set({ accessToken, refreshToken });
  },

  login: (user: User) => {
    saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    set({ currentUser: user, isAuthenticated: true });
  },

  logout: () => {
    removeFromStorage(STORAGE_KEYS.CURRENT_USER_ID);
    removeFromStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeFromStorage(STORAGE_KEYS.REFRESH_TOKEN);
    set({
      currentUser: undefined,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
    });
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
