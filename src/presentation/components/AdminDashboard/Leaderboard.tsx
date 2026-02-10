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
} from '@mui/material';
import type { User, Kudo } from 'domain/models';
import { getDisplayName } from 'shared/utils/userHelpers';
import { SPACING, COLORS, FONT_SIZE, BORDER_RADIUS, FONT_WEIGHT } from 'presentation/theme/designSystem';

const RANK_COLORS = ['#E6B800', '#9E9E9E', '#B87333'] as const;

interface LeaderboardProps {
  users: User[];
  kudos: Kudo[];
}

export const Leaderboard = ({ users, kudos }: LeaderboardProps) => {
  const leaderboardData = useMemo(() => {
    const pointsReceived = new Map<string, number>();
    kudos.forEach((kudo) => {
      if (kudo.receiver_id && kudo.points) {
        pointsReceived.set(
          kudo.receiver_id,
          (pointsReceived.get(kudo.receiver_id) || 0) + kudo.points
        );
      }
    });
    const entries = users.map((user) => ({
      user,
      totalReceived: pointsReceived.get(user.id!) || 0,
    }));
    return entries
      .sort((a, b) => b.totalReceived - a.totalReceived)
      .slice(0, 10);
  }, [users, kudos]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: SPACING.MEDIUM,
        borderRadius: BORDER_RADIUS.LG,
        border: `1px solid ${COLORS.GRAY[200]}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: FONT_WEIGHT.SEMIBOLD, mb: SPACING.SMALL }}>
        Top earners
      </Typography>

      {leaderboardData.length === 0 ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
          <Typography variant="body2" sx={{ color: COLORS.TEXT.SECONDARY }}>
            No data yet
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: FONT_WEIGHT.SEMIBOLD, py: 1, borderColor: COLORS.GRAY[200] }}>#</TableCell>
                <TableCell sx={{ fontWeight: FONT_WEIGHT.SEMIBOLD, py: 1, borderColor: COLORS.GRAY[200] }}>Name</TableCell>
                <TableCell sx={{ fontWeight: FONT_WEIGHT.SEMIBOLD, py: 1, borderColor: COLORS.GRAY[200] }}>Dept</TableCell>
                <TableCell align="right" sx={{ fontWeight: FONT_WEIGHT.SEMIBOLD, py: 1, borderColor: COLORS.GRAY[200] }}>Pts</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboardData.map((entry, index) => (
                <TableRow
                  key={entry.user.id}
                  sx={{
                    bgcolor: index < 3 ? COLORS.SUCCESS_LIGHT : undefined,
                    '&:hover': { bgcolor: COLORS.GRAY[50] },
                  }}
                >
                  <TableCell sx={{ py: 1, borderColor: COLORS.GRAY[100], width: 40 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: FONT_WEIGHT.SEMIBOLD,
                        color: index < 3 ? RANK_COLORS[index] : COLORS.TEXT.SECONDARY,
                        width: 20,
                        textAlign: 'center',
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1, borderColor: COLORS.GRAY[100] }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: SPACING.SMALL }}>
                      <Avatar
                        src={entry.user.avatar}
                        alt={getDisplayName(entry.user)}
                        sx={{ width: 28, height: 28 }}
                      />
                      <Typography sx={{ fontSize: FONT_SIZE.BASE, fontWeight: FONT_WEIGHT.MEDIUM }}>
                        {getDisplayName(entry.user)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1, borderColor: COLORS.GRAY[100] }}>
                    <Typography sx={{ fontSize: FONT_SIZE.SMALL, color: COLORS.TEXT.SECONDARY }}>
                      {entry.user.department ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1, borderColor: COLORS.GRAY[100] }}>
                    <Typography sx={{ fontSize: FONT_SIZE.BASE, fontWeight: FONT_WEIGHT.SEMIBOLD, color: COLORS.PRIMARY.MAIN }}>
                      {entry.totalReceived}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};
