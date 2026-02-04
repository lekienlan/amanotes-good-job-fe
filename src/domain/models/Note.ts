/**
 * Domain Model: Note
 * Represents a MIDI note in the piano roll
 */

export interface Note {
  id: string;
  midiNumber: number; // MIDI note number (e.g., 60 = C4, 48 = C3)
  time: number; // Start time in seconds (0-300)
  duration: number; // Duration in seconds
  velocity: number; // 0-127 (MIDI velocity)
}
