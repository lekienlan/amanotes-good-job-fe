import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import type { CoreValue, Kudo, User } from 'domain/models';
import { getDisplayName } from 'shared/utils/userHelpers';
import { EMOJI_REACTIONS } from 'shared/constants/app';
import {
  COLORS,
  SPACING,
  FONT_SIZE,
  BORDER_RADIUS,
  SHADOWS
} from 'presentation/theme/designSystem';

interface KudoCardProps {
  kudo: Kudo;
  onReaction: (kudoId: string, emoji: string, userId: string) => void;
  currentUser?: User;
  users: User[];
  coreValues: CoreValue[];
}

export const KudoCard = ({ kudo, onReaction, currentUser, users, coreValues }: KudoCardProps) => {

  const sender = users.find((u) => u.id === kudo.sender_id);
  const receiver = users.find((u) => u.id === kudo.receiver_id);
  const coreValue = coreValues.find((cv) => cv.id === kudo.core_value_id);

  // Group reactions by emoji
  const reactionCounts = new Map<
    string,
    { count: number; userIds: string[] }
  >();
  (kudo.reactions || []).forEach((reaction) => {
    const current = reactionCounts.get(reaction.emoji!) || {
      count: 0,
      userIds: []
    };
    reactionCounts.set(reaction.emoji!, {
      count: current.count + 1,
      userIds: [...current.userIds, reaction.user_id!]
    });
  });

  const handleReactionClick = (emoji: string) => {
    if (currentUser?.id && kudo.id) {
      onReaction(kudo.id, emoji, currentUser.id);
    }
  };

  const hasUserReacted = (emoji: string) => {
    const reaction = reactionCounts.get(emoji);
    return reaction?.userIds.includes(currentUser?.id || '') || false;
  };

  return (
    <Card
      sx={{
        mb: SPACING.MEDIUM,
        borderRadius: BORDER_RADIUS.MEDIUM,
        boxShadow: SHADOWS.BASE
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: SPACING.SMALL }}>
          <Avatar
            src={sender?.avatar}
            alt={getDisplayName(sender)}
            sx={{ width: 40, height: 40, mr: SPACING.SMALL }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {getDisplayName(sender)} → {getDisplayName(receiver)}
            </Typography>
            <Typography variant="caption" sx={{ color: COLORS.TEXT.SECONDARY }}>
              {kudo.created_at
                ? formatDistanceToNow(new Date(kudo.created_at), { addSuffix: true })
                : ''}
            </Typography>
          </Box>
          <Chip
            label={`${kudo.points} pts`}
            sx={{
              bgcolor: COLORS.PRIMARY.MAIN,
              color: 'white',
              fontWeight: 600,
              fontSize: FONT_SIZE.SMALL
            }}
          />
        </Box>

        {/* Core Value */}
        {coreValue && (
          <Chip
            label={`${coreValue.emoji} ${coreValue.name}`}
            size="small"
            sx={{ mb: SPACING.SMALL, bgcolor: COLORS.GRAY[100] }}
          />
        )}

        {/* Description */}
        <Typography
          variant="body2"
          sx={{ mb: SPACING.MEDIUM, color: COLORS.TEXT.PRIMARY }}
        >
          {kudo.description}
        </Typography>

        {/* Reactions */}
        <Box
          sx={{
            height: 40,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 1
          }}
        >
          {/* Existing reactions */}
          {Array.from(reactionCounts.entries()).map(([emoji, data]) => (
            <Chip
              key={emoji}
              label={`${emoji} ${data.count}`}
              size="small"
              onClick={() => handleReactionClick(emoji)}
              sx={{
                cursor: 'pointer',
                bgcolor: hasUserReacted(emoji)
                  ? COLORS.PRIMARY.LIGHT
                  : COLORS.GRAY[100],
                '&:hover': { bgcolor: COLORS.PRIMARY.LIGHT }
              }}
            />
          ))}

          {/* Quick reaction buttons */}
          <Box
            sx={{
              display: 'flex',
              ml: 'auto',
              gap: 2
            }}
          >
            {EMOJI_REACTIONS.map((emoji) => (
              <IconButton
                key={emoji}
                size="small"
                onClick={() => handleReactionClick(emoji)}
                sx={{
                  color: COLORS.TEXT.PRIMARY,
                  fontSize: FONT_SIZE.SMALL,
                  width: 16,
                  height: 16,
                  bgcolor: hasUserReacted(emoji)
                    ? COLORS.PRIMARY.LIGHT
                    : 'transparent'
                }}
              >
                {emoji}
              </IconButton>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
