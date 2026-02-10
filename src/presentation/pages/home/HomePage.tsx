import { useState } from 'react';
import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { KudosFeed, SendKudosForm } from 'presentation/components';
import { COLORS } from 'presentation/theme/designSystem';

export const HomePage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <Box sx={{ position: 'relative' }}>
      <KudosFeed />

      <Fab
        color="primary"
        aria-label="send kudos"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          bgcolor: COLORS.PRIMARY.MAIN,
          '&:hover': { bgcolor: COLORS.PRIMARY.DARK },
        }}
        onClick={() => setIsFormOpen(true)}
      >
        <AddIcon />
      </Fab>

      <SendKudosForm open={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </Box>
  );
};
