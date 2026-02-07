import { useCallback } from 'react';
import type { User } from 'domain/models';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from 'shared/utils/localStorage';
import { MOCK_USERS } from 'shared/mocks';
import { shouldResetBudget, getMonthStart } from 'shared/utils/dateHelpers';
import { APP_CONFIG } from 'shared/constants/app';

export const useUsersRepository = () => {
  const getAllUsers = useCallback(async (): Promise<User[]> => {
    return loadFromStorage<User[]>(STORAGE_KEYS.USERS, MOCK_USERS);
  }, []);

  const getUserById = useCallback(async (id: string): Promise<User | null> => {
    const users = await getAllUsers();
    return users.find(u => u.id === id) || null;
  }, [getAllUsers]);

  const updateUser = useCallback(async (
    id: string,
    updates: Partial<User>
  ): Promise<User | null> => {
    const users = await getAllUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) return null;

    users[userIndex] = { ...users[userIndex], ...updates };
    saveToStorage(STORAGE_KEYS.USERS, users);

    return users[userIndex];
  }, [getAllUsers]);

  const checkAndResetBudget = useCallback(async (user: User): Promise<User> => {
    if (shouldResetBudget(user.last_budget_reset)) {
      const updatedUser = await updateUser(user.id!, {
        giving_budget: APP_CONFIG.DEFAULT_GIVING_BUDGET,
        last_budget_reset: getMonthStart(),
      });
      return updatedUser || user;
    }
    return user;
  }, [updateUser]);

  return {
    getAllUsers,
    getUserById,
    updateUser,
    checkAndResetBudget,
  };
};
