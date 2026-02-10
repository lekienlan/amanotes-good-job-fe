import { Box, Typography, CircularProgress } from '@mui/material';
import {
  useKudosFeed,
  useCurrentUser,
  useSyncUsers,
  useCoreValues,
} from 'domain/usecases';
import { KudoCard } from './KudoCard';
import { SPACING, COLORS } from 'presentation/theme/designSystem';

export const KudosFeed = () => {
  const { kudos, isLoading, toggleReaction } = useKudosFeed();
  const { currentUser } = useCurrentUser();
  const { users } = useSyncUsers();
  const { coreValues } = useCoreValues();

  if (!currentUser) {
    return (
      <Box sx={{ textAlign: 'center', py: SPACING.XLARGE }}>
        <Typography variant="h6" sx={{ color: COLORS.TEXT.SECONDARY }}>
          Please select a user to view the feed
        </Typography>
      </Box>
    );
  }

  if (isLoading && kudos.length === 0) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', py: SPACING.XLARGE }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (kudos.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: SPACING.XLARGE }}>
        <Typography
          variant="h6"
          sx={{ color: COLORS.TEXT.SECONDARY, mb: SPACING.SMALL }}
        >
          No kudos yet
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY }}>
          Be the first to recognize a colleague!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: SPACING.MEDIUM,
          color: COLORS.TEXT.PRIMARY
        }}
      >
        Live Kudos Feed
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: 4
        }}
      >
        {kudos.map((kudo) => (
          <KudoCard
            key={kudo.id}
            kudo={kudo}
            onReaction={toggleReaction}
            currentUser={currentUser}
            users={users}
            coreValues={coreValues}
          />
        ))}
      </Box>
    </Box>
  );
};
