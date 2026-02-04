/**
 * Presentation: MIDI Grid Component
 * Main piano roll grid with note editing capabilities
 */

import { useState, useRef } from 'react';
import { Box } from '@mui/material';
import { Stage, Layer, Line, Text, Rect } from 'react-konva';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useMidiStore } from 'data/store/useMidiStore';
import { PianoKeyboard } from '../PianoKeyboard';
import {
  KEY_HEIGHT,
  MAX_TIME,
  GRID_WIDTH,
  GRID_HEIGHT,
  PIANO_KEYBOARD_WIDTH,
  MIN_MIDI_NOTE,
  MAX_MIDI_NOTE,
  NOTE_COLOR,
  NOTE_SELECTED_COLOR,
  isBlackKey
} from 'shared/constants/grid';
import {
  pixelToTime,
  pixelToMidiNote,
  timeToPixel,
  midiNoteToPixel
} from 'shared/utils/gridUtils';
import type { Note } from 'domain/models/Note';

export const MidiGrid = () => {
  const {
    notes,
    selectedNoteId,
    addNote,
    removeNote,
    updateNote,
    setSelectedNoteId
  } = useMidiStore();
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{
    x: number;
    y: number;
    midiNote: number;
  } | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const relativeX = pointerPosition.x - PIANO_KEYBOARD_WIDTH;

    if (relativeX < 0) return; // Clicked on piano keyboard

    // Check if clicked on empty space
    if (e.target === stage || e.target.getClassName() === 'Layer') {
      const midiNote = pixelToMidiNote(pointerPosition.y);

      setIsDrawing(true);
      setDrawStart({ x: relativeX, y: pointerPosition.y, midiNote });
    }
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !drawStart) return;

    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;

    const relativeX = pointerPosition.x - PIANO_KEYBOARD_WIDTH;
    const startTime = pixelToTime(drawStart.x);
    const endTime = pixelToTime(relativeX);
    const duration = Math.max(0.25, Math.abs(endTime - startTime)); // Minimum 0.25s

    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random()}`,
      midiNumber: drawStart.midiNote,
      time: Math.min(startTime, endTime),
      duration,
      velocity: 100
    };

    addNote(newNote);
    setIsDrawing(false);
    setDrawStart(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMouseMove = (_e: KonvaEventObject<MouseEvent>) => {
    // Visual feedback while drawing could be added here
  };

  const handleNoteDragEnd = (note: Note, e: KonvaEventObject<DragEvent>) => {
    const newX = e.target.x();
    const newY = e.target.y();
 
    const newTime = pixelToTime(newX);
    const newMidiNote = pixelToMidiNote(newY);

    updateNote(note.id, {
      time: Math.max(0, newTime),
      midiNumber: newMidiNote
    });
  };

  const handleNoteClick = (noteId: string, e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button === 2) {
      // Right click - delete
      e.evt.preventDefault();
      removeNote(noteId);
    } else {
      // Left click - select
      setSelectedNoteId(noteId);
    }
  };

  // Generate grid lines
  const gridLines = [];
  const keyCount = MAX_MIDI_NOTE - MIN_MIDI_NOTE + 1;

  // Horizontal lines (one per piano key)
  for (let i = 0; i <= keyCount; i++) {
    const y = i * KEY_HEIGHT;
    const midiNote = MAX_MIDI_NOTE - i;
    const isBlack = isBlackKey(midiNote);

    gridLines.push(
      <Rect
        key={`bg-${i}`}
        x={0}
        y={y}
        width={GRID_WIDTH}
        height={KEY_HEIGHT}
        fill={isBlack ? '#1a1a1a' : '#222'}
      />,
      <Line
        key={`h-${i}`}
        points={[0, y, GRID_WIDTH, y]}
        stroke="#333"
        strokeWidth={midiNote % 12 === 0 ? 2 : 0.5} // Thicker line on C notes
      />
    );
  }

  // Vertical lines (time markers every 5 seconds)
  for (let i = 0; i <= MAX_TIME; i += 5) {
    const x = timeToPixel(i);
    const isMainBeat = i % 10 === 0;
    gridLines.push(
      <Line
        key={`v-${i}`}
        points={[x, 0, x, GRID_HEIGHT]}
        stroke={isMainBeat ? '#444' : '#333'}
        strokeWidth={isMainBeat ? 1.5 : 0.5}
      />
    );
  }

  // Time labels
  const timeLabels = [];
  for (let i = 0; i <= MAX_TIME; i += 10) {
    const x = timeToPixel(i);
    timeLabels.push(
      <Text
        key={`time-${i}`}
        x={x + 3}
        y={3}
        text={`${i}s`}
        fontSize={11}
        fill="#999"
      />
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        overflow: 'auto',
        maxWidth: '100%',
        maxHeight: '70vh',
        backgroundColor: '#1a1a1a',
        borderRadius: 1
      }}
    >
      {/* Piano Keyboard */}
      <Stage width={PIANO_KEYBOARD_WIDTH} height={GRID_HEIGHT}>
        <PianoKeyboard />
      </Stage>

      {/* Piano Roll Grid */}
      <Stage
        ref={stageRef}
        width={GRID_WIDTH}
        height={GRID_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          {/* Grid background and lines */}
          {gridLines}
          {timeLabels}

          {/* Notes as rectangles */}
          {notes.map((note) => (
            <Rect
              key={note.id}
              x={timeToPixel(note.time)}
              y={midiNoteToPixel(note.midiNumber)}
              width={timeToPixel(note.duration)}
              height={KEY_HEIGHT - 2}
              fill={
                selectedNoteId === note.id ? NOTE_SELECTED_COLOR : NOTE_COLOR
              }
              stroke="#2e7d32"
              strokeWidth={1}
              cornerRadius={2}
              draggable
              onDragEnd={(e) => handleNoteDragEnd(note, e)}
              onClick={(e) => handleNoteClick(note.id, e)}
              onContextMenu={(e) => handleNoteClick(note.id, e)}
              shadowBlur={3}
              shadowColor="#000"
            />
          ))}
        </Layer>
      </Stage>
    </Box>
  );
};
