import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import type { Kudo, Reaction, Pagination } from 'domain/models';
import {
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS
} from 'shared/utils/localStorage';
import { MOCK_KUDOS } from 'shared/mocks';
import { apiClient } from 'data/api/axios';

const KUDOS_QUERY_KEY = ['kudos'] as const;

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

  const getAllKudos = useCallback(async (): Promise<{
    data: Kudo[];
    pagination: Pagination;
  }> => {
    return queryClient.fetchQuery({
      queryKey: KUDOS_QUERY_KEY,
      queryFn: () => fetchKudosList()
    });
  }, [queryClient]);

  const sendKudo = useCallback(async (data: Partial<Kudo>): Promise<Kudo> => {
    const newKudo: Kudo = {
      id: uuidv4(),
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      points: data.points,
      description: data.description,
      core_value_id: data.core_value_id,
      created_at: new Date().toISOString(),
      reactions: []
    };

    const kudos = loadFromStorage<Kudo[]>(STORAGE_KEYS.KUDOS, MOCK_KUDOS);
    kudos.unshift(newKudo);
    saveToStorage(STORAGE_KEYS.KUDOS, kudos);

    return newKudo;
  }, []);

  const addReaction = useCallback(
    async (
      kudoId: string,
      emoji: string,
      userId: string
    ): Promise<Kudo | null> => {
      const kudos = loadFromStorage<Kudo[]>(STORAGE_KEYS.KUDOS, MOCK_KUDOS);
      const kudoIndex = kudos.findIndex((k) => k.id === kudoId);

      if (kudoIndex === -1) return null;

      const kudo = kudos[kudoIndex];
      const reactions = kudo.reactions ?? [];

      const existingReactionIndex = reactions.findIndex(
        (r) => r.user_id === userId && r.emoji === emoji
      );

      if (existingReactionIndex >= 0) {
        reactions.splice(existingReactionIndex, 1);
      } else {
        const newReaction: Reaction = {
          id: uuidv4(),
          kudo_id: kudoId,
          user_id: userId,
          emoji,
          created_at: new Date().toISOString()
        };
        reactions.push(newReaction);
      }

      kudos[kudoIndex] = { ...kudo, reactions };
      saveToStorage(STORAGE_KEYS.KUDOS, kudos);

      return kudos[kudoIndex];
    },
    []
  );

  return {
    getAllKudos,
    sendKudo,
    addReaction,
    kudos: kudosResponse?.data ?? [],
    pagination: kudosResponse?.pagination,
    isKudosLoading,
    kudosError,
    refetchKudos
  };
};
