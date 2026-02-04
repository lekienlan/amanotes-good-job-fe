/**
 * Presentation: Main App Component
 * Root component of the MIDI Piano Roll application
 */

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Typography } from '@mui/material';
import { MidiGrid } from 'presentation/components/MidiGrid';
import { PlaybackControls } from 'presentation/components/PlaybackControls';
import { theme } from 'presentation/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          p: 2.5,
          backgroundColor: 'background.default',
          minHeight: '100vh',
          color: 'text.primary'
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: 'center',
            mb: 1.25,
            fontWeight: 'bold'
          }}
        >
          MIDI Piano Roll Editor
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: 2.5
          }}
        >
          Click and drag to create notes • Right-click to delete • Drag notes to
          move • Each row = piano key
        </Typography>

        <PlaybackControls />
        <MidiGrid />
      </Box>
    </ThemeProvider>
  );
}

export default App;
