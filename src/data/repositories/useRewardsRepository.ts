import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Reward, Redemption } from 'domain/models';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from 'shared/utils/localStorage';
import { MOCK_REWARDS } from 'shared/mocks';

export const useRewardsRepository = () => {
  const getAllRewards = useCallback(async (): Promise<Reward[]> => {
    const rewards = loadFromStorage<Reward[]>(STORAGE_KEYS.REWARDS, MOCK_REWARDS);
    return rewards.filter(r => r.is_active);
  }, []);

  const getRedemptions = useCallback(async (userId?: string): Promise<Redemption[]> => {
    const redemptions = loadFromStorage<Redemption[]>(STORAGE_KEYS.REDEMPTIONS, []);
    if (userId) {
      return redemptions.filter(r => r.user_id === userId);
    }
    return redemptions;
  }, []);

  const redeemReward = useCallback(async (
    userId: string,
    rewardId: string,
    pointsCost: number
  ): Promise<Redemption> => {
    // Create redemption record
    const newRedemption: Redemption = {
      id: uuidv4(),
      user_id: userId,
      reward_id: rewardId,
      points_spent: pointsCost,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    const redemptions = await getRedemptions();
    redemptions.push(newRedemption);
    saveToStorage(STORAGE_KEYS.REDEMPTIONS, redemptions);

    // Update reward stock
    const rewards = await getAllRewards();
    const rewardIndex = rewards.findIndex(r => r.id === rewardId);
    
    if (rewardIndex >= 0 && rewards[rewardIndex].stock !== undefined) {
      rewards[rewardIndex] = {
        ...rewards[rewardIndex],
        stock: rewards[rewardIndex].stock! - 1,
      };
      saveToStorage(STORAGE_KEYS.REWARDS, rewards);
    }

    return newRedemption;
  }, [getAllRewards, getRedemptions]);

  return {
    getAllRewards,
    getRedemptions,
    redeemReward,
  };
};
