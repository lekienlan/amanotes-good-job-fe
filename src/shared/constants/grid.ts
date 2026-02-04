/**
 * Shared Constants: Grid Configuration
 * Piano roll grid configuration constants
 */

import { PIANO_ROLL, COLORS } from 'presentation/theme/designSystem';

// Piano Roll Configuration
export const KEY_HEIGHT = PIANO_ROLL.KEY_HEIGHT; // pixels per piano key
export const TIME_SCALE = PIANO_ROLL.TIME_SCALE; // pixels per second (increased for better visibility)
export const MAX_TIME = PIANO_ROLL.MAX_TIME; // seconds

// Piano range: C3 (48) to B5 (83) = 36 keys (3 octaves)
export const MIN_MIDI_NOTE = PIANO_ROLL.MIN_MIDI_NOTE; // C3
export const MAX_MIDI_NOTE = PIANO_ROLL.MAX_MIDI_NOTE; // B5
export const KEY_COUNT = MAX_MIDI_NOTE - MIN_MIDI_NOTE + 1; // 36 keys

export const GRID_WIDTH = MAX_TIME * TIME_SCALE;
export const GRID_HEIGHT = KEY_COUNT * KEY_HEIGHT;
export const PIANO_KEYBOARD_WIDTH = PIANO_ROLL.KEYBOARD_WIDTH; // Width of piano keyboard on the left

// Note colors
export const NOTE_COLOR = COLORS.NOTE.DEFAULT;
export const NOTE_SELECTED_COLOR = COLORS.NOTE.SELECTED;

// Piano key helpers
export const isBlackKey = (midiNumber: number): boolean => {
  const note = midiNumber % 12;
  return [1, 3, 6, 8, 10].includes(note); // C#, D#, F#, G#, A#
};

export const getNoteNameFromMidi = (midiNumber: number): string => {
  const noteNames = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
  ];
  const octave = Math.floor(midiNumber / 12) - 1;
  const noteName = noteNames[midiNumber % 12];
  return `${noteName}${octave}`;
};
