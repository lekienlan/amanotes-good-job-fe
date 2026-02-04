/**
 * Use Case: Play Sequence
 * Handles the business logic for playing a sequence of notes
 */

import type { Note } from '../entities/Note';
import type { IAudioRepository } from '../repositories/IAudioRepository';

export class PlaySequenceUseCase {
  constructor(private audioRepository: IAudioRepository) {}

  execute(notes: Note[], onProgress?: (time: number) => void): void {
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

    this.audioRepository.playSequence(notes, onProgress);
  }
}
