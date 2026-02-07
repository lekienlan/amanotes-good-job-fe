import { useState, useCallback } from 'react';
import type { Redemption } from 'domain/models';
import { useRewardsRepository, useUsersRepository } from 'data/repositories';
import { useAuthStore, useUsersStore } from 'data/store';
import { validateRewardRedemption } from 'shared/utils/validation';

export const useRedeemReward = () => {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const { redeemReward } = useRewardsRepository();
  const { updateUser } = useUsersRepository();
  const currentUser = useAuthStore((state) => state.currentUser);
  const updateCurrentUser = useAuthStore((state) => state.updateCurrentUser);
  const updateUserInStore = useUsersStore((state) => state.updateUser);

  const execute = useCallback(
    async (rewardId: string, pointsCost: number): Promise<Redemption | null> => {
      // Prevent double-spending with flag
      if (isRedeeming) {
        return null;
      }

      setIsRedeeming(true);
      setError(undefined);

      try {
        // Validate current user
        if (!currentUser?.id) {
          throw new Error('You must be logged in to redeem rewards');
        }

        // Validate balance
        const balanceError = validateRewardRedemption(
          pointsCost,
          currentUser.points_balance || 0
        );
        if (balanceError) throw new Error(balanceError);

        // Create redemption (atomic operation)
        const redemption = await redeemReward(
          currentUser.id!,
          rewardId,
          pointsCost
        );

        // Deduct points from user balance
        const newBalance = (currentUser.points_balance || 0) - pointsCost;
        await updateUser(currentUser.id!, { points_balance: newBalance });
        updateCurrentUser({ points_balance: newBalance });
        updateUserInStore(currentUser.id!, { points_balance: newBalance });

        setIsRedeeming(false);
        return redemption;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to redeem reward';
        setError(errorMessage);
        setIsRedeeming(false);
        return null;
      }
    },
    [
      isRedeeming,
      currentUser,
      redeemReward,
      updateUser,
      updateCurrentUser,
      updateUserInStore,
    ]
  );

  return { execute, isRedeeming, error };
};
