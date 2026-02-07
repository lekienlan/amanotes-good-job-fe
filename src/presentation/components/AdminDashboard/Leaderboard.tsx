import { useMemo } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
  Chip,
} from '@mui/material';
import type { User, Kudo } from 'domain/models';
import { getDisplayName } from 'shared/utils/userHelpers';
import { SPACING, COLORS, FONT_SIZE } from 'presentation/theme/designSystem';

interface LeaderboardProps {
  users: User[];
  kudos: Kudo[];
}

export const Leaderboard = ({ users, kudos }: LeaderboardProps) => {
  const leaderboardData = useMemo(() => {
    // Count points received per user
    const pointsReceived = new Map<string, number>();
    
    kudos.forEach((kudo) => {
      if (kudo.receiver_id && kudo.points) {
        pointsReceived.set(
          kudo.receiver_id,
          (pointsReceived.get(kudo.receiver_id) || 0) + kudo.points
        );
      }
    });

    // Create leaderboard entries
    const entries = users.map((user) => ({
      user,
      totalReceived: pointsReceived.get(user.id!) || 0,
    }));

    // Sort by total received (descending) and take top 10
    return entries
      .sort((a, b) => b.totalReceived - a.totalReceived)
      .slice(0, 10);
  }, [users, kudos]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: SPACING.LARGE,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: SPACING.MEDIUM }}>
        Top Point Earners
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Points Earned
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((entry, index) => (
              <TableRow
                key={entry.user.id}
                sx={{
                  bgcolor: index < 3 ? COLORS.SUCCESS_LIGHT : undefined,
                  '&:hover': { bgcolor: COLORS.GRAY[100] },
                }}
              >
                <TableCell>
                  <Chip
                    label={index + 1}
                    size="small"
                    sx={{
                      bgcolor:
                        index === 0
                          ? '#FFD700'
                          : index === 1
                            ? '#C0C0C0'
                            : index === 2
                              ? '#CD7F32'
                              : COLORS.GRAY[100],
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: SPACING.SMALL }}>
                    <Avatar
                      src={entry.user.avatar}
                      alt={getDisplayName(entry.user)}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography sx={{ fontSize: FONT_SIZE.MEDIUM, fontWeight: 500 }}>
                      {getDisplayName(entry.user)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: FONT_SIZE.SMALL, color: COLORS.TEXT.SECONDARY }}>
                    {entry.user.department}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${entry.totalReceived} pts`}
                    sx={{
                      bgcolor: COLORS.PRIMARY.MAIN,
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
