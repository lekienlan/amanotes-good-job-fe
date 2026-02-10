import { useCallback, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from 'data/store';
import type { Kudo, Pagination } from 'domain/models';
import {
  connectKudosSocket,
  disconnectKudosSocket,
  onKudoCreated,
  onKudoUpdated,
  onKudoDeleted,
  onKudoReactionAdded,
  onKudoReactionRemoved
} from 'data/repositories/kudosSocket';
import { useKudosRepository } from 'data/repositories';
import { KUDOS_QUERY_KEY } from 'data/repositories/useKudosRepository';

/**
 * Ensures the kudo has required id for feed updates.
 */
function toKudoWithId(kudo: Kudo): Kudo {
  return { ...kudo, id: kudo.id ?? '' };
}

/**
 * Subscribes to realtime kudo feed WebSocket events and updates React Query cache.
 */
function subscribeKudosRealtime(
  queryClient: ReturnType<typeof useQueryClient>,
  accessToken: string | null
) {
  const socket = connectKudosSocket(accessToken);
  if (!socket) return () => {};

  const unsubCreated = onKudoCreated((kudo) => {
    queryClient.setQueryData<{ data: Kudo[]; pagination?: Pagination }>(
      KUDOS_QUERY_KEY,
      (prev) => {
        if (!prev) return prev;
        const k = toKudoWithId(kudo);
        if (prev.data.some((x) => x.id === k.id)) return prev;
        return { ...prev, data: [k, ...prev.data] };
      }
    );
  });

  const unsubUpdated = onKudoUpdated((kudo) => {
    queryClient.setQueryData<{ data: Kudo[]; pagination?: Pagination }>(
      KUDOS_QUERY_KEY,
      (prev) => {
        if (!prev) return prev;
        const k = toKudoWithId(kudo);
        return {
          ...prev,
          data: prev.data.map((x) => (x.id === k.id ? k : x))
        };
      }
    );
  });

  const unsubDeleted = onKudoDeleted(({ id }) => {
    queryClient.setQueryData<{ data: Kudo[]; pagination?: Pagination }>(
      KUDOS_QUERY_KEY,
      (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.filter((x) => x.id !== id)
        };
      }
    );
  });

  const unsubReactionAdded = onKudoReactionAdded((kudo) => {
    queryClient.setQueryData<{ data: Kudo[]; pagination?: Pagination }>(
      KUDOS_QUERY_KEY,
      (prev) => {
        if (!prev) return prev;
        const k = toKudoWithId(kudo);
        return {
          ...prev,
          data: prev.data.map((x) => (x.id === k.id ? k : x))
        };
      }
    );
  });

  const unsubReactionRemoved = onKudoReactionRemoved((kudo) => {
    queryClient.setQueryData<{ data: Kudo[]; pagination?: Pagination }>(
      KUDOS_QUERY_KEY,
      (prev) => {
        if (!prev) return prev;
        const k = toKudoWithId(kudo);
        return {
          ...prev,
          data: prev.data.map((x) => (x.id === k.id ? k : x))
        };
      }
    );
  });

  return () => {
    unsubCreated();
    unsubUpdated();
    unsubDeleted();
    unsubReactionAdded();
    unsubReactionRemoved();
    disconnectKudosSocket();
  };
}

export const useKudosFeed = () => {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);

  const {
    kudos: repoKudos,
    pagination,
    isKudosLoading,
    kudosError,
    refetchKudos,
    addReaction
  } = useKudosRepository();

  useEffect(() => {
    const cleanup = subscribeKudosRealtime(queryClient, accessToken);
    return cleanup;
  }, [accessToken, queryClient]);

  const loadKudos = useCallback(() => {
    refetchKudos();
  }, [refetchKudos]);

  const toggleReaction = useCallback(
    async (kudoId: string, emoji: string, userId: string) => {
      await addReaction(kudoId, emoji, userId);
      refetchKudos();
    },
    [addReaction, refetchKudos]
  );

  const sortedKudos = useMemo(() => {
    return [...repoKudos].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [repoKudos]);

  return {
    kudos: sortedKudos,
    pagination,
    isLoading: isKudosLoading,
    error: kudosError,
    loadKudos,
    toggleReaction
  };
};
