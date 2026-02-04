/**
 * Shared Utils: Grid Utilities
 * Utility functions for grid calculations
 */

import {
  KEY_HEIGHT,
  TIME_SCALE,
  MIN_MIDI_NOTE,
  MAX_MIDI_NOTE
} from 'shared/constants/grid';

export const pixelToTime = (x: number): number => {
  return Math.max(0, x / TIME_SCALE);
};

export const pixelToMidiNote = (y: number): number => {
  // Y-axis is inverted: top of screen = higher notes
  const noteIndex = Math.floor(y / KEY_HEIGHT);
  const midiNote = MAX_MIDI_NOTE - noteIndex;
  return Math.max(MIN_MIDI_NOTE, Math.min(MAX_MIDI_NOTE, midiNote));
};

export const timeToPixel = (time: number): number => {
  return time * TIME_SCALE;
};

export const midiNoteToPixel = (midiNumber: number): number => {
  // Y-axis is inverted: higher notes = smaller Y values
  const noteIndex = MAX_MIDI_NOTE - midiNumber;
  return noteIndex * KEY_HEIGHT;
};

export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};
