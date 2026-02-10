import { useEffect } from 'react';
import { useUsersRepository } from 'data/repositories';
import { useAuthStore, useUsersStore } from 'data/store';

/**
 * Use case: sync users from API to store and set current user.
 * Presentation must use this (or another use case) instead of calling useUsersRepository directly.
 */
export const useSyncUsers = () => {
  const { users: apiUsers, refetchUsers } = useUsersRepository();
  const setUsers = useUsersStore((state) => state.setUsers);
  const loadCurrentUser = useAuthStore((state) => state.loadCurrentUser);

  useEffect(() => {
    if (apiUsers?.length) {
      setUsers(apiUsers);
      loadCurrentUser(apiUsers);
    }
  }, [apiUsers, setUsers, loadCurrentUser]);

  return { users: apiUsers, refetchUsers };
};
