/**
 * Use Case Hook: Play Note
 * Custom hook for playing a single note with validation
 */

import { useCallback } from 'react';
import { useAudioRepository } from 'data/repositories/useAudioRepository';

export const usePlayNote = () => {
  const { playNote: playNoteFromRepo } = useAudioRepository();

  const execute = useCallback(async (
    midiNote: number,
    duration: number = 0.5,
    velocity: number = 100
  ): Promise<void> => {
    // Validate inputs
    if (midiNote < 0 || midiNote > 127) {
      throw new Error('MIDI note must be between 0 and 127');
    }

    if (velocity < 0 || velocity > 127) {
      throw new Error('Velocity must be between 0 and 127');
    }

    if (duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }

    await playNoteFromRepo(midiNote, duration, velocity);
  }, [playNoteFromRepo]);

  return { execute };
};
