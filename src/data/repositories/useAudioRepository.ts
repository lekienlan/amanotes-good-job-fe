/**
 * Data Layer: Audio Repository Hook
 * Custom hook for audio repository operations
 */

import { useCallback, useRef } from 'react';
import * as Tone from 'tone';
import type { Note } from 'domain/models/Note';

export const useAudioRepository = () => {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const isInitializedRef = useRef(false);

  const initialize = useCallback(async () => {
    if (isInitializedRef.current) return;

    // Initialize audio context on user interaction (required by browsers)
    await Tone.start();

    // Create a single polyphonic synth for all notes
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();

    isInitializedRef.current = true;
  }, []);

  const playNote = useCallback(async (
    midiNote: number,
    duration: number = 0.5,
    velocity: number = 100
  ) => {
    // Initialize if not already done (first user interaction)
    if (!isInitializedRef.current) {
      await initialize();
    }

    if (!synthRef.current) {
      throw new Error('Synth not available');
    }

    const frequency = Tone.Frequency(midiNote, 'midi').toFrequency();
    synthRef.current.triggerAttackRelease(
      frequency,
      duration,
      undefined,
      velocity / 127
    );
  }, [initialize]);

  const playSequence = useCallback((
    notes: Note[],
    onProgress?: (time: number) => void
  ) => {
    if (!isInitializedRef.current || !synthRef.current) {
      throw new Error('Audio not initialized. Call initialize() first.');
    }

    // Clear any existing scheduled events
    Tone.Transport.cancel();

    // Schedule all notes
    notes.forEach((note) => {
      Tone.Transport.schedule((time) => {
        const frequency = Tone.Frequency(note.midiNumber, 'midi').toFrequency();
        synthRef.current!.triggerAttackRelease(
          frequency,
          note.duration,
          time,
          note.velocity / 127
        );
      }, note.time);
    });

    // Update progress callback
    if (onProgress) {
      const updateProgress = () => {
        if (Tone.Transport.state === 'started') {
          onProgress(Tone.Transport.seconds);
          requestAnimationFrame(updateProgress);
        }
      };
      updateProgress();
    }

    // Start playback
    Tone.Transport.start();
  }, []);

  const pause = useCallback(() => {
    Tone.Transport.pause();
  }, []);

  const stop = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }, []);

  const setTempo = useCallback((bpm: number) => {
    Tone.Transport.bpm.value = bpm;
  }, []);

  const getCurrentTime = useCallback((): number => {
    return Tone.Transport.seconds;
  }, []);

  const isPlaying = useCallback((): boolean => {
    return Tone.Transport.state === 'started';
  }, []);

  return {
    initialize,
    playNote,
    playSequence,
    pause,
    stop,
    setTempo,
    getCurrentTime,
    isPlaying,
    isInitialized: isInitializedRef.current
  };
};
