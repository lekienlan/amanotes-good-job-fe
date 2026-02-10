import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User, Pagination } from 'domain/models';
import { apiClient } from 'data/api/axios';
import { shouldResetBudget, getMonthStart } from 'shared/utils/dateHelpers';

const USERS_QUERY_KEY = ['users'] as const;

export interface UsersListParams {
  page?: number;
  limit?: number;
}

async function fetchUsersList(params?: UsersListParams): Promise<{
  data: User[];
  pagination: Pagination;
}> {
  const { data } = await apiClient.get<{
    data: User[];
    pagination: Pagination;
  }>('/api/v1/users', {
    params: { page: params?.page, limit: params?.limit }
  });
  return {
    data: data.data ?? [],
    pagination: data.pagination
  };
}

export const useUsersRepository = () => {
  const queryClient = useQueryClient();

  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: () => fetchUsersList({ page: 1, limit: 100 })
  });

  const users = usersResponse?.data ?? [];
  const pagination = usersResponse?.pagination;

  const getUserById = useCallback(
    async (id: string): Promise<User | null> => {
      try {
        const { data } = await apiClient.get<{ data: User }>(
          `/api/v1/users/${id}`
        );
        return data?.data ?? null;
      } catch {
        // Fallback: find in cached list from query
        const cached = queryClient.getQueryData<{
          data: User[];
          pagination: Pagination;
        }>(USERS_QUERY_KEY);
        const found = cached?.data?.find((u) => u.id === id);
        return found ?? null;
      }
    },
    [queryClient]
  );

  const updateUser = useCallback(
    async (id: string, updates: Partial<User>): Promise<User | null> => {
      try {
        const { data } = await apiClient.patch<{ data: User }>(
          `/api/v1/users/${id}`,
          updates
        );
        await queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        return data?.data ?? null;
      } catch {
        return null;
      }
    },
    [queryClient]
  );

  const checkAndResetBudget = useCallback(
    async (user: User): Promise<User> => {
      if (shouldResetBudget(user.last_budget_reset)) {
        const updatedUser = await updateUser(user.id!, {
          last_budget_reset: getMonthStart()
        });
        return updatedUser ?? user;
      }
      return user;
    },
    [updateUser]
  );

  /** Fetch users with optional pagination (for components that need a promise) */
  const getAllUsers = useCallback(async (): Promise<User[]> => {
    const result = await fetchUsersList({ page: 1, limit: 100 });
    return result.data;
  }, []);

  return {
    users,
    pagination,
    isUsersLoading,
    usersError,
    refetchUsers,
    getAllUsers,
    getUserById,
    updateUser,
    checkAndResetBudget
  };
};
