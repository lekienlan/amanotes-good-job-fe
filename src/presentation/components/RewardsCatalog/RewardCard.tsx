import { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { Reward } from 'domain/models';
import { useAuthStore } from 'data/store';
import { useRedeemReward } from 'domain/usecases';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from 'presentation/theme/designSystem';

interface RewardCardProps {
  reward: Reward;
}

export const RewardCard = ({ reward }: RewardCardProps) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { execute, isRedeeming, error } = useRedeemReward();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const userBalance = currentUser?.points_balance || 0;
  const canAfford = userBalance >= (reward.points_cost || 0);
  const outOfStock = (reward.stock || 0) <= 0;

  const handleRedeem = async () => {
    const result = await execute(reward.id!, reward.points_cost!);
    if (result) {
      setConfirmOpen(false);
      setSuccessOpen(true);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: BORDER_RADIUS.MEDIUM,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={reward.image_url}
          alt={reward.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ mb: SPACING.SMALL }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: SPACING.XSMALL, fontSize: FONT_SIZE.LARGE }}
            >
              {reward.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: COLORS.TEXT.SECONDARY, mb: SPACING.SMALL }}
            >
              {reward.description}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: SPACING.MEDIUM, flexWrap: 'wrap' }}>
            <Chip
              label={`${reward.points_cost} pts`}
              sx={{
                bgcolor: COLORS.PRIMARY.MAIN,
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              label={`${reward.stock} available`}
              size="small"
              sx={{
                bgcolor: outOfStock ? COLORS.ERROR : COLORS.SUCCESS_LIGHT,
                color: outOfStock ? 'white' : COLORS.TEXT.PRIMARY,
              }}
            />
          </Box>

          <Button
            variant="contained"
            fullWidth
            disabled={!canAfford || outOfStock || isRedeeming}
            onClick={() => setConfirmOpen(true)}
            sx={{
              mt: 'auto',
              bgcolor: COLORS.PRIMARY.MAIN,
              '&:disabled': { bgcolor: COLORS.TEXT.SECONDARY },
            }}
          >
            {outOfStock
              ? 'Out of Stock'
              : !canAfford
                ? `Need ${(reward.points_cost || 0) - userBalance} more pts`
                : 'Redeem'}
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => !isRedeeming && setConfirmOpen(false)}>
        <DialogTitle>Confirm Redemption</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: SPACING.MEDIUM }}>
              {error}
            </Alert>
          )}
          <Typography>
            Are you sure you want to redeem <strong>{reward.name}</strong> for{' '}
            <strong>{reward.points_cost} points</strong>?
          </Typography>
          <Typography variant="body2" sx={{ mt: SPACING.SMALL, color: COLORS.TEXT.SECONDARY }}>
            Your new balance will be: {userBalance - (reward.points_cost || 0)} points
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={isRedeeming}>
            Cancel
          </Button>
          <Button
            onClick={handleRedeem}
            variant="contained"
            disabled={isRedeeming}
            startIcon={isRedeeming ? <CircularProgress size={20} /> : undefined}
            sx={{ bgcolor: COLORS.PRIMARY.MAIN }}
          >
            {isRedeeming ? 'Redeeming...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
        <DialogTitle>Redemption Successful!</DialogTitle>
        <DialogContent>
          <Typography>
            You've successfully redeemed <strong>{reward.name}</strong>!
          </Typography>
          <Typography variant="body2" sx={{ mt: SPACING.SMALL, color: COLORS.TEXT.SECONDARY }}>
            Your request is pending approval. You'll be notified once it's processed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
