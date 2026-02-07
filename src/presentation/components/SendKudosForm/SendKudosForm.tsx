import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Slider,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuthStore, useUsersStore } from 'data/store';
import { useSendKudo } from 'domain/usecases';
import { MOCK_CORE_VALUES } from 'shared/mocks';
import { KUDO_CONSTRAINTS } from 'shared/utils/validation';
import { getDisplayName } from 'shared/utils/userHelpers';
import { COLORS, SPACING, FONT_SIZE } from 'presentation/theme/designSystem';
import type { User, CoreValue } from 'domain/models';

interface SendKudosFormProps {
  open: boolean;
  onClose: () => void;
}

export const SendKudosForm = ({ open, onClose }: SendKudosFormProps) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const users = useUsersStore((state) => state.users);
  const { execute, isLoading, error } = useSendKudo();

  const [recipient, setRecipient] = useState<User | null>(null);
  const [points, setPoints] = useState(25);
  const [description, setDescription] = useState('');
  const [selectedCoreValue, setSelectedCoreValue] = useState<CoreValue | null>(null);
  const [formError, setFormError] = useState<string | undefined>();

  // Get recipients (exclude current user)
  const availableRecipients = users.filter((u) => u.id !== currentUser?.id);

  // Reset form
  const resetForm = () => {
    setRecipient(null);
    setPoints(25);
    setDescription('');
    setSelectedCoreValue(null);
    setFormError(undefined);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setFormError(undefined);

    if (!recipient) {
      setFormError('Please select a recipient');
      return;
    }

    if (!selectedCoreValue) {
      setFormError('Please select a core value');
      return;
    }

    if (description.trim().length < KUDO_CONSTRAINTS.MIN_DESCRIPTION_LENGTH) {
      setFormError(
        `Description must be at least ${KUDO_CONSTRAINTS.MIN_DESCRIPTION_LENGTH} characters`
      );
      return;
    }

    const result = await execute({
      receiver_id: recipient.id!,
      points,
      description,
      core_value_id: selectedCoreValue.id!,
    });

    if (result) {
      resetForm();
      onClose();
    }
  };

  const remainingBudget = currentUser?.giving_budget || 0;
  const canAfford = points <= remainingBudget;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: FONT_SIZE.XLARGE, fontWeight: 600 }}>
        Send Kudos
      </DialogTitle>

      <DialogContent sx={{ pt: SPACING.MEDIUM }}>
        {(error || formError) && (
          <Alert severity="error" sx={{ mb: SPACING.MEDIUM }}>
            {error || formError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: SPACING.MEDIUM }}>
          {/* Recipient */}
          <Autocomplete
            value={recipient}
            onChange={(_, newValue) => setRecipient(newValue)}
            options={availableRecipients}
            getOptionLabel={(option) => `${getDisplayName(option)} - ${option.department ?? ''}`}
            renderInput={(params) => (
              <TextField {...params} label="Recipient" required fullWidth />
            )}
            disabled={isLoading}
          />

          {/* Points Slider */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Points: {points}
            </Typography>
            <Slider
              value={points}
              onChange={(_, value) => setPoints(value as number)}
              min={KUDO_CONSTRAINTS.MIN_POINTS}
              max={KUDO_CONSTRAINTS.MAX_POINTS}
              step={5}
              marks
              valueLabelDisplay="auto"
              disabled={isLoading}
              sx={{
                '& .MuiSlider-markLabel': { fontSize: FONT_SIZE.SMALL },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: canAfford ? COLORS.TEXT.SECONDARY : COLORS.ERROR,
                fontWeight: canAfford ? 400 : 600,
              }}
            >
              Remaining budget: {remainingBudget} points
            </Typography>
          </Box>

          {/* Core Value */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Core Value *
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {MOCK_CORE_VALUES.map((value) => (
                <Chip
                  key={value.id}
                  label={`${value.emoji} ${value.name}`}
                  onClick={() => setSelectedCoreValue(value)}
                  color={selectedCoreValue?.id === value.id ? 'primary' : 'default'}
                  disabled={isLoading}
                  sx={{
                    cursor: 'pointer',
                    bgcolor:
                      selectedCoreValue?.id === value.id ? COLORS.PRIMARY.MAIN : undefined,
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Description */}
          <TextField
            label="Description"
            required
            multiline
            rows={4}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe why you're recognizing this person..."
            helperText={`${description.length}/${KUDO_CONSTRAINTS.MIN_DESCRIPTION_LENGTH} characters minimum`}
            disabled={isLoading}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: SPACING.LARGE, pb: SPACING.MEDIUM }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !canAfford}
          startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
          sx={{ bgcolor: COLORS.PRIMARY.MAIN }}
        >
          {isLoading ? 'Sending...' : 'Send Kudos'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
