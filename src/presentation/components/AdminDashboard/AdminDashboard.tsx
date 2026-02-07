import { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useKudosRepository } from 'data/repositories';
import { useUsersStore, useKudosStore } from 'data/store';
import { CoreValuesChart } from './CoreValuesChart';
import { Leaderboard } from './Leaderboard';
import { SPACING, COLORS } from 'presentation/theme/designSystem';

export const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { getAllKudos } = useKudosRepository();
  const users = useUsersStore((state) => state.users);
  const kudos = useKudosStore((state) => state.kudos);
  const setKudos = useKudosStore((state) => state.setKudos);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { data } = await getAllKudos();
        setKudos(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [getAllKudos, setKudos]);

  if (isLoading) {
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

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: SPACING.LARGE }}>
        Admin Dashboard
      </Typography>

      {/* Summary Stats */}
      <Box sx={{ display: 'flex', gap: 3, mb: SPACING.LARGE, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <Paper
            elevation={2}
            sx={{
              p: SPACING.LARGE,
              textAlign: 'center',
              bgcolor: COLORS.PRIMARY.LIGHT,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.PRIMARY.MAIN }}>
              {totalKudos}
            </Typography>
            <Typography variant="body1" sx={{ color: COLORS.TEXT.SECONDARY }}>
              Total Kudos Sent
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Paper
            elevation={2}
            sx={{
              p: SPACING.LARGE,
              textAlign: 'center',
              bgcolor: COLORS.SUCCESS_LIGHT,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.SUCCESS }}>
              {totalPointsGiven}
            </Typography>
            <Typography variant="body1" sx={{ color: COLORS.TEXT.SECONDARY }}>
              Total Points Given
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <Paper
            elevation={2}
            sx={{
              p: SPACING.LARGE,
              textAlign: 'center',
              bgcolor: COLORS.WARNING_LIGHT,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: COLORS.WARNING }}>
              {activeUsers}
            </Typography>
            <Typography variant="body1" sx={{ color: COLORS.TEXT.SECONDARY }}>
              Active Users
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Charts */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 500px' }}>
          <CoreValuesChart kudos={kudos} />
        </Box>
        <Box sx={{ flex: '1 1 500px' }}>
          <Leaderboard users={users} kudos={kudos} />
        </Box>
      </Box>
    </Box>
  );
};
