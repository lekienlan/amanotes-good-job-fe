/**
 * Presentation: Piano Keyboard Component
 * Displays the piano keyboard on the left side of the piano roll
 */

import { useState } from 'react';
import { Layer, Rect, Text } from 'react-konva';
import {
  MIN_MIDI_NOTE,
  MAX_MIDI_NOTE,
  KEY_HEIGHT,
  PIANO_KEYBOARD_WIDTH,
  isBlackKey,
  getNoteNameFromMidi
} from 'shared/constants/grid';
import { usePlayNote } from 'domain/usecases/usePlayNote';

export const PianoKeyboard = () => {
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const { execute: playNote } = usePlayNote();
  
  const handleKeyClick = async (midiNote: number) => {
    setActiveKey(midiNote);
    
    try {
      await playNote(midiNote);
    } catch (error) {
      console.error('Error playing note:', error);
    }
    
    // Reset active state after a short delay
    setTimeout(() => {
      setActiveKey(null);
    }, 200);
  };

  const keys = [];

  for (let midiNote = MAX_MIDI_NOTE; midiNote >= MIN_MIDI_NOTE; midiNote--) {
    const isBlack = isBlackKey(midiNote);
    const noteIndex = MAX_MIDI_NOTE - midiNote;
    const y = noteIndex * KEY_HEIGHT;

    // Piano key with click handler
    const isActive = activeKey === midiNote;
    keys.push(
      <Rect
        key={`white-${midiNote}`}
        x={0}
        y={y}
        width={PIANO_KEYBOARD_WIDTH}
        height={KEY_HEIGHT}
        fill={isActive ? (isBlack ? '#555' : '#ddd') : (isBlack ? '#333' : '#fff')}
        stroke="#000"
        strokeWidth={1}
        onClick={() => handleKeyClick(midiNote)}
        onTap={() => handleKeyClick(midiNote)}
        style={{ cursor: 'pointer' }}
      />
    );

    // Show note name on C notes
    if (midiNote % 12 === 0) {
      keys.push(
        <Text
          key={`label-${midiNote}`}
          x={5}
          y={y + KEY_HEIGHT / 2 - 6}
          text={getNoteNameFromMidi(midiNote)}
          fontSize={11}
          fill={isBlack ? '#fff' : '#000'}
          fontStyle="bold"
        />
      );
    }
  }

  return <Layer>{keys}</Layer>;
};
