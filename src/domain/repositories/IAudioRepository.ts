/**
 * Domain Interface: Audio Repository
 * Defines the contract for audio playback operations
 */

import type { Note } from 'domain/models/Note';

export interface IAudioRepository {
  /**
   * Initialize the audio system
   */
  initialize(): Promise<void>;

  /**
   * Play a single note immediately
   * @param midiNote - MIDI note number (0-127)
   * @param duration - Duration in seconds
   * @param velocity - Velocity (0-127)
   */
  playNote(midiNote: number, duration?: number, velocity?: number): Promise<void>;

  /**
   * Play a sequence of notes
   * @param notes - Array of notes to play
   * @param onProgress - Callback for playback progress
   */
  playSequence(notes: Note[], onProgress?: (time: number) => void): void;

  /**
   * Pause playback
   */
  pause(): void;

  /**
   * Stop playback
   */
  stop(): void;

  /**
   * Set tempo in BPM
   * @param bpm - Beats per minute
   */
  setTempo(bpm: number): void;

  /**
   * Get current playback time
   */
  getCurrentTime(): number;

  /**
   * Check if audio is currently playing
   */
  isPlaying(): boolean;
}
