import { useState, useCallback, useEffect } from 'react';
import type { Reward } from 'domain/models';
import { useRewardsRepository } from 'data/repositories';

/**
 * Use case: load and expose rewards for the catalog.
 * Presentation must use this instead of calling useRewardsRepository directly.
 */
export const useRewardsCatalog = () => {
  const { getAllRewards } = useRewardsRepository();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRewards = useCallback(async () => {
    setIsLoading(true);
    try {
      const loaded = await getAllRewards();
      setRewards(loaded);
    } catch (error) {
      console.error('Failed to load rewards:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getAllRewards]);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  return { rewards, isLoading, loadRewards };
};
