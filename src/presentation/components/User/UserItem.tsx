import { Box, Avatar, Typography } from '@mui/material';
import type { User } from 'domain/models';
import { getDisplayName } from 'shared/utils/userHelpers';

interface UserItemProps {
  user: User;
  avatarSize?: number;
}

export const UserItem = ({ user, avatarSize = 28 }: UserItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Avatar
      src={user.avatar}
      alt={getDisplayName(user)}
      sx={{ width: avatarSize, height: avatarSize }}
    />
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {getDisplayName(user)} · {user.email}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {user.role}
      </Typography>
    </Box>
  </Box>
);
