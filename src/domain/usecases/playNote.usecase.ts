/**
 * Use Case: Play Note
 * Handles the business logic for playing a single note
 */

import type { IAudioRepository } from '../repositories/IAudioRepository';

export class PlayNoteUseCase {
  constructor(private audioRepository: IAudioRepository) {}

  async execute(midiNote: number, duration: number = 0.5, velocity: number = 100): Promise<void> {
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

    await this.audioRepository.playNote(midiNote, duration, velocity);
  }
}
