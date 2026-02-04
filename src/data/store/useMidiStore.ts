/**
 * Data Layer: MIDI Store
 * State management for MIDI notes using Zustand
 */

import { create } from 'zustand';
import type { Note } from 'domain/models/Note';

interface MidiStore {
  notes: Note[];
  selectedNoteId: string | null;
  isPlaying: boolean;
  currentTime: number;

  addNote: (note: Note) => void;
  removeNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  setSelectedNoteId: (id: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  clearAllNotes: () => void;
}

export const useMidiStore = create<MidiStore>((set) => ({
  notes: [],
  selectedNoteId: null,
  isPlaying: false,
  currentTime: 0,

  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note]
    })),

  removeNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      selectedNoteId: state.selectedNoteId === id ? null : state.selectedNoteId
    })),

  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      )
    })),

  setSelectedNoteId: (id) => set({ selectedNoteId: id }),

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setCurrentTime: (time) => set({ currentTime: time }),

  clearAllNotes: () => set({ notes: [], selectedNoteId: null })
}));
