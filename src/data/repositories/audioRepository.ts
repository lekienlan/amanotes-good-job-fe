/**
 * Data Layer: Audio Repository Implementation
 * Implements IAudioRepository using Tone.js
 */

import * as Tone from 'tone';
import type { Note } from 'domain/models/Note';
import type { IAudioRepository } from 'domain/repositories/IAudioRepository';

export class AudioRepository implements IAudioRepository {
  private synth: Tone.PolySynth | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize audio context on user interaction (required by browsers)
    await Tone.start();

    // Create a single polyphonic synth for all notes
    this.synth = new Tone.PolySynth(Tone.Synth, {
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();

    this.isInitialized = true;
  }

  async playNote(midiNote: number, duration: number = 0.5, velocity: number = 100): Promise<void> {
    // Initialize if not already done (first user interaction)
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.synth) {
      throw new Error('Synth not available');
    }

    const frequency = Tone.Frequency(midiNote, 'midi').toFrequency();
    this.synth.triggerAttackRelease(
      frequency,
      duration,
      undefined,
      velocity / 127
    );
  }

  playSequence(notes: Note[], onProgress?: (time: number) => void): void {
    if (!this.isInitialized || !this.synth) {
      throw new Error('Audio not initialized. Call initialize() first.');
    }

    // Clear any existing scheduled events
    Tone.Transport.cancel();

    // Schedule all notes
    notes.forEach((note) => {
      Tone.Transport.schedule((time) => {
        const frequency = Tone.Frequency(note.midiNumber, 'midi').toFrequency();
        this.synth!.triggerAttackRelease(
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
  }

  pause(): void {
    Tone.Transport.pause();
  }

  stop(): void {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  setTempo(bpm: number): void {
    Tone.Transport.bpm.value = bpm;
  }

  getCurrentTime(): number {
    return Tone.Transport.seconds;
  }

  isPlaying(): boolean {
    return Tone.Transport.state === 'started';
  }
}

// Export singleton instance
export const audioRepository = new AudioRepository();
