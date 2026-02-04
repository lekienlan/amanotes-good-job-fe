/**
 * Use Case Hook: Play Sequence
 * Custom hook for playing a sequence of notes with validation
 */

import { useCallback } from 'react';
import type { Note } from 'domain/models/Note';
import { useAudioRepository } from 'data/repositories/useAudioRepository';

export const usePlaySequence = () => {
  const { playSequence: playSequenceFromRepo } = useAudioRepository();

  const execute = useCallback((
    notes: Note[],
    onProgress?: (time: number) => void
  ): void => {
    // Validate inputs
    if (!notes || notes.length === 0) {
      throw new Error('Notes array cannot be empty');
    }

    // Validate each note
    for (const note of notes) {
      if (note.midiNumber < 0 || note.midiNumber > 127) {
        throw new Error(`Invalid MIDI note number: ${note.midiNumber}`);
      }
      if (note.velocity < 0 || note.velocity > 127) {
        throw new Error(`Invalid velocity: ${note.velocity}`);
      }
      if (note.duration <= 0) {
        throw new Error(`Invalid duration: ${note.duration}`);
      }
      if (note.time < 0) {
        throw new Error(`Invalid time: ${note.time}`);
      }
    }

    playSequenceFromRepo(notes, onProgress);
  }, [playSequenceFromRepo]);

  return { execute };
};
