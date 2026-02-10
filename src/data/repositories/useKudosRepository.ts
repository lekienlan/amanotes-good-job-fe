import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Kudo, Pagination } from 'domain/models';
import { apiClient } from 'data/api/axios';

export const KUDOS_QUERY_KEY = ['kudos'] as const;

async function fetchKudosList(params?: {
  page?: number;
  limit?: number;
}): Promise<{ data: Kudo[]; pagination: Pagination }> {
  const { data } = await apiClient.get<{
    data: Kudo[];
    pagination: Pagination;
  }>('/api/v1/kudos', { params: { page: params?.page, limit: params?.limit } });
  return {
    data: data.data ?? [],
    pagination: data.pagination
  };
}

export const useKudosRepository = () => {
  const queryClient = useQueryClient();
  const {
    data: kudosResponse,
    isLoading: isKudosLoading,
    error: kudosError,
    refetch: refetchKudos
  } = useQuery({
    queryKey: KUDOS_QUERY_KEY,
    queryFn: () => fetchKudosList()
  });

  const sendKudo = useCallback(
    async (data: Partial<Kudo>): Promise<Kudo> => {
      const response = await apiClient.post<Kudo>('/api/v1/kudos', {
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        points: data.points,
        description: data.description,
        core_value_id: data.core_value_id
      });
      await queryClient.invalidateQueries({ queryKey: KUDOS_QUERY_KEY });
      console.log(response.data);
      if (!response.data) {
        throw new Error('Failed to create kudo');
      }
      return response.data;
    },
    [queryClient]
  );

  const addReaction = useCallback(
    async (
      kudoId: string,
      emoji: string,
      userId: string
    ): Promise<Kudo | null> => {
      console.log(userId);
      try {
        const { data } = await apiClient.post<{ data: Kudo }>(
          `/api/v1/kudos/${kudoId}/reactions`,
          { emoji, user_id: 'acaa70fc-7a74-4ce5-96a3-d884da418a88' }
        );
        await queryClient.invalidateQueries({ queryKey: KUDOS_QUERY_KEY });
        return data?.data ?? null;
      } catch {
        return null;
      }
    },
    [queryClient]
  );

  return {
    sendKudo,
    addReaction,
    kudos: kudosResponse?.data ?? [],
    pagination: kudosResponse?.pagination,
    isKudosLoading,
    kudosError,
    refetchKudos
  };
};
