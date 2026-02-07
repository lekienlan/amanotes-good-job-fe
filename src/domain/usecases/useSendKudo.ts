import { useState, useCallback } from 'react';
import type { Kudo } from 'domain/models';
import { useKudosRepository, useUsersRepository } from 'data/repositories';
import { useAuthStore, useKudosStore, useUsersStore } from 'data/store';
import {
  validateKudoPoints,
  validateKudoDescription,
  validateGivingBudget,
} from 'shared/utils/validation';

interface SendKudoData {
  receiver_id: string;
  points: number;
  description: string;
  core_value_id: string;
}

export const useSendKudo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const { sendKudo } = useKudosRepository();
  const { updateUser, checkAndResetBudget, getUserById } = useUsersRepository();
  const currentUser = useAuthStore((state) => state.currentUser);
  const updateCurrentUser = useAuthStore((state) => state.updateCurrentUser);
  const addKudo = useKudosStore((state) => state.addKudo);
  const updateUserInStore = useUsersStore((state) => state.updateUser);

  const execute = useCallback(
    async (data: SendKudoData): Promise<Kudo | null> => {
      setIsLoading(true);
      setError(undefined);

      try {
        // Validate current user
        if (!currentUser?.id) {
          throw new Error('You must be logged in to send kudos');
        }

        // Check and reset budget if needed
        const userWithCurrentBudget = await checkAndResetBudget(currentUser);
        if (userWithCurrentBudget.giving_budget !== currentUser.giving_budget) {
          updateCurrentUser({
            giving_budget: userWithCurrentBudget.giving_budget,
            last_budget_reset: userWithCurrentBudget.last_budget_reset,
          });
        }

        // Validate can't send to self
        if (data.receiver_id === currentUser.id) {
          throw new Error('You cannot send kudos to yourself');
        }

        // Validate points
        const pointsError = validateKudoPoints(data.points);
        if (pointsError) throw new Error(pointsError);

        // Validate description
        const descriptionError = validateKudoDescription(data.description);
        if (descriptionError) throw new Error(descriptionError);

        // Validate giving budget
        const budgetError = validateGivingBudget(
          data.points,
          userWithCurrentBudget.giving_budget || 0
        );
        if (budgetError) throw new Error(budgetError);

        // Validate core value selected
        if (!data.core_value_id) {
          throw new Error('Please select a core value');
        }

        // Create kudo
        const newKudo = await sendKudo({
          sender_id: currentUser.id,
          receiver_id: data.receiver_id,
          points: data.points,
          description: data.description.trim(),
          core_value_id: data.core_value_id,
        });

        // Update sender's giving budget
        const newSenderBudget = (userWithCurrentBudget.giving_budget || 0) - data.points;
        await updateUser(currentUser.id!, { giving_budget: newSenderBudget });
        updateCurrentUser({ giving_budget: newSenderBudget });
        updateUserInStore(currentUser.id!, { giving_budget: newSenderBudget });

        // Update receiver's points balance
        const receiver = await getUserById(data.receiver_id);
        if (receiver?.id) {
          const newReceiverBalance = (receiver.points_balance || 0) + data.points;
          await updateUser(receiver.id, { points_balance: newReceiverBalance });
          updateUserInStore(receiver.id, { points_balance: newReceiverBalance });
        }

        // Add to feed
        addKudo(newKudo);

        setIsLoading(false);
        return newKudo;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send kudo';
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    },
    [
      currentUser,
      sendKudo,
      updateUser,
      checkAndResetBudget,
      getUserById,
      updateCurrentUser,
      addKudo,
      updateUserInStore,
    ]
  );

  return { execute, isLoading, error };
};
