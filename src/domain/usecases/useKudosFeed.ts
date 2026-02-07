import { useCallback, useMemo } from 'react';
import { useKudosRepository } from 'data/repositories';

export const useKudosFeed = () => {
  const {
    kudos: repoKudos,
    pagination,
    isKudosLoading,
    kudosError,
    refetchKudos,
    addReaction,
  } = useKudosRepository();

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
    toggleReaction,
  };
};
