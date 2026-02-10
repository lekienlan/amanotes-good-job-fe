import { useState, useCallback } from 'react';
import type { Kudo } from 'domain/models';
import { useKudosRepository } from 'data/repositories';
import { useAuthStore, useKudosStore } from 'data/store';
import {
  validateKudoPoints,
  validateKudoDescription,
  validateGivingBudget
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
  const currentUser = useAuthStore((state) => state.currentUser);
  const addKudo = useKudosStore((state) => state.addKudo);

  const execute = useCallback(
    async (data: SendKudoData): Promise<Kudo | null> => {
      setIsLoading(true);
      setError(undefined);

      try {
        if (!currentUser?.id) {
          throw new Error('You must be logged in to send kudos');
        }

        if (data.receiver_id === currentUser.id) {
          throw new Error('You cannot send kudos to yourself');
        }

        const pointsError = validateKudoPoints(data.points);
        if (pointsError) throw new Error(pointsError);

        const descriptionError = validateKudoDescription(data.description);
        if (descriptionError) throw new Error(descriptionError);

        const budgetError = validateGivingBudget(
          data.points,
          currentUser.giving_budget || 0
        );
        if (budgetError) throw new Error(budgetError);

        if (!data.core_value_id) {
          throw new Error('Please select a core value');
        }

        const newKudo = await sendKudo({
          sender_id: currentUser.id,
          receiver_id: data.receiver_id,
          points: data.points,
          description: data.description.trim(),
          core_value_id: data.core_value_id
        });

        addKudo(newKudo);

        setIsLoading(false);
        return newKudo;
      } catch (err) {
        console.log(err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send kudo';
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    },
    [currentUser, sendKudo, addKudo]
  );

  return { execute, isLoading, error };
};
