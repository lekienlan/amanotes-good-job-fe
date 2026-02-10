import { useCallback } from 'react';
import type { Reward, Redemption, Pagination } from 'domain/models';
import {
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS
} from 'shared/utils/localStorage';
import { apiClient } from 'data/api/axios';

type RewardsApiResponse = {
  data: Reward[];
  pagination: Pagination;
};

export const useRewardsRepository = () => {
  const getAllRewards = useCallback(async (): Promise<Reward[]> => {
    const { data } = await apiClient.get<RewardsApiResponse>('/api/v1/rewards');

    const rewards = (data?.data ?? []).filter((reward) => reward.is_active);

    // Persist latest rewards snapshot locally so redemption logic can update stock
    saveToStorage(STORAGE_KEYS.REWARDS, rewards);

    return rewards;
  }, []);

  const getRedemptions = useCallback(
    async (userId?: string): Promise<Redemption[]> => {
      const redemptions = loadFromStorage<Redemption[]>(
        STORAGE_KEYS.REDEMPTIONS,
        []
      );
      if (userId) {
        return redemptions.filter((r) => r.user_id === userId);
      }
      return redemptions;
    },
    []
  );

  const redeemReward = useCallback(
    async (
      userId: string,
      rewardId: string,
      pointsCost: number
    ): Promise<Redemption> => {
      const resp = await apiClient.post<Redemption>('/api/v1/redemptions', {
        user_id: userId,
        reward_id: rewardId,
        points_spent: pointsCost
      });

      if (!resp.data) {
        throw new Error('Failed to redeem reward');
      }

      const existingRedemptions = loadFromStorage<Redemption[]>(
        STORAGE_KEYS.REDEMPTIONS,
        []
      );
      const updatedRedemptions = [...existingRedemptions, resp.data];
      saveToStorage(STORAGE_KEYS.REDEMPTIONS, updatedRedemptions);

      return resp.data;
    },
    []
  );

  return {
    getAllRewards,
    getRedemptions,
    redeemReward
  };
};
