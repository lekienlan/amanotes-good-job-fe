/**
 * Presentation: Playback Controls Component
 * Controls for playing, pausing, stopping, and managing MIDI playback
 */

import { useState, useEffect } from 'react';
import { Box, Button, Typography, Slider, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMidiStore } from 'data/store/useMidiStore';
import { useAudioRepository } from 'data/repositories/useAudioRepository';
import { usePlaySequence } from 'domain/usecases/usePlaySequence';

export const PlaybackControls = () => {
  const { notes, isPlaying, setIsPlaying, setCurrentTime, clearAllNotes } =
    useMidiStore();
  const [tempo, setTempo] = useState(120);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const audioRepo = useAudioRepository();
  const { execute: playSequence } = usePlaySequence();

  useEffect(() => {
    audioRepo.setTempo(tempo);
  }, [tempo, audioRepo]);

  const handleInitialize = async () => {
    await audioRepo.initialize();
    setIsInitialized(true);
  };

  const handlePlay = async () => {
    if (!isInitialized) {
      await handleInitialize();
    }

    try {
      playSequence(notes, (time) => {
        setCurrentTime(time);
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing sequence:', error);
    }
  };

  const handlePause = () => {
    audioRepo.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    audioRepo.stop();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleClear = () => {
    if (confirm('Clear all notes?')) {
      clearAllNotes();
    }
  };

  return (
    <Box
      sx={{
        p: 2.5,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        mb: 2.5
      }}
    >
      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          mb: 1.875,
          flexWrap: 'wrap'
        }}
      >
        {!isInitialized && (
          <Button
            variant="contained"
            color="inherit"
            onClick={handleInitialize}
            sx={{
              bgcolor: '#444',
              '&:hover': {
                bgcolor: '#555'
              }
            }}
          >
            Initialize Audio
          </Button>
        )}

        {isInitialized && (
          <>
            {!isPlaying ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handlePlay}
                startIcon={<PlayArrowIcon />}
              >
                Play
              </Button>
            ) : (
              <Button
                variant="contained"
                color="inherit"
                onClick={handlePause}
                startIcon={<PauseIcon />}
                sx={{
                  bgcolor: '#444',
                  '&:hover': {
                    bgcolor: '#555'
                  }
                }}
              >
                Pause
              </Button>
            )}
            <Button
              variant="contained"
              color="inherit"
              onClick={handleStop}
              startIcon={<StopIcon />}
              sx={{
                bgcolor: '#444',
                '&:hover': {
                  bgcolor: '#555'
                }
              }}
            >
              Stop
            </Button>
          </>
        )}

        <Button
          variant="contained"
          color="secondary"
          onClick={handleClear}
          startIcon={<DeleteIcon />}
        >
          Clear All
        </Button>
      </Stack>

      <Box sx={{ mb: 1.875 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            mb: 0.625
          }}
        >
          Tempo: {tempo} BPM
        </Typography>
        <Slider
          value={tempo}
          onChange={(_event, value) => setTempo(value as number)}
          min={60}
          max={200}
          valueLabelDisplay="auto"
          sx={{
            width: 200,
            color: 'primary.main'
          }}
        />
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary'
        }}
      >
        Notes: {notes.length}
      </Typography>
    </Box>
  );
};
