import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import type { Reward } from 'domain/models';
import { useRewardsRepository } from 'data/repositories';
import { useAuthStore } from 'data/store';
import { RewardCard } from './RewardCard';
import { SPACING, COLORS } from 'presentation/theme/designSystem';

export const RewardsCatalog = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.currentUser);
  const { getAllRewards } = useRewardsRepository();

  useEffect(() => {
    const loadRewards = async () => {
      setIsLoading(true);
      try {
        const loadedRewards = await getAllRewards();
        setRewards(loadedRewards);
      } catch (error) {
        console.error('Failed to load rewards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRewards();
  }, [getAllRewards]);

  if (!currentUser) {
    return (
      <Box sx={{ textAlign: 'center', py: SPACING.XLARGE }}>
        <Typography variant="h6" sx={{ color: COLORS.TEXT.SECONDARY }}>
          Please select a user to view rewards
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: SPACING.XLARGE }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: SPACING.LARGE }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: SPACING.SMALL }}>
          Rewards Catalog
        </Typography>
        <Alert severity="info" sx={{ mb: SPACING.MEDIUM }}>
          You have <strong>{currentUser.points_balance || 0} points</strong> available to spend
        </Alert>
      </Box>

      {rewards.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: SPACING.XLARGE }}>
          <Typography variant="h6" sx={{ color: COLORS.TEXT.SECONDARY }}>
            No rewards available at the moment
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {rewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </Box>
      )}
    </Box>
  );
};
