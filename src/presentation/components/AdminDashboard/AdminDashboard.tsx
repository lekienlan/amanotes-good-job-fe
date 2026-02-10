import { useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useKudosFeed, useSyncUsers, useCoreValues } from 'domain/usecases';
import { CoreValuesChart } from './CoreValuesChart';
import { Leaderboard } from './Leaderboard';
import { SPACING, COLORS, BORDER_RADIUS, FONT_WEIGHT } from 'presentation/theme/designSystem';

export const AdminDashboard = () => {
  const { kudos, isLoading: isKudosLoading } = useKudosFeed();
  const { users } = useSyncUsers();
  const { coreValues, ensureCoreValuesLoaded } = useCoreValues();

  useEffect(() => {
    ensureCoreValuesLoaded();
  }, [ensureCoreValuesLoaded]);

  if (isKudosLoading && kudos.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: SPACING.XLARGE }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalKudos = kudos.length;
  const totalPointsGiven = kudos.reduce((sum, kudo) => sum + (kudo.points || 0), 0);
  const activeUsers = new Set([
    ...kudos.map((k) => k.sender_id),
    ...kudos.map((k) => k.receiver_id),
  ]).size;

  const stats = [
    { value: totalKudos, label: 'Kudos sent', color: COLORS.PRIMARY.MAIN, bg: COLORS.PRIMARY.LIGHT },
    { value: totalPointsGiven, label: 'Points given', color: COLORS.SUCCESS, bg: COLORS.SUCCESS_LIGHT },
    { value: activeUsers, label: 'Active users', color: COLORS.WARNING, bg: COLORS.WARNING_LIGHT },
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: FONT_WEIGHT.SEMIBOLD, mb: SPACING.MEDIUM }}>
        Dashboard
      </Typography>

      {/* Compact summary stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: SPACING.MEDIUM,
          mb: SPACING.LARGE,
        }}
      >
        {stats.map(({ value, label, color, bg }) => (
          <Paper
            key={label}
            elevation={0}
            sx={{
              p: SPACING.MEDIUM,
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.MEDIUM,
              borderRadius: BORDER_RADIUS.LG,
              border: `1px solid ${COLORS.GRAY[200]}`,
              bgcolor: bg,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: FONT_WEIGHT.BOLD, color, minWidth: 48 }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY, fontWeight: FONT_WEIGHT.MEDIUM }}>
              {label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Charts row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: SPACING.LARGE,
          alignItems: 'start',
        }}
      >
        <CoreValuesChart kudos={kudos} coreValues={coreValues} />
        <Leaderboard users={users} kudos={kudos} />
      </Box>
    </Box>
  );
};
