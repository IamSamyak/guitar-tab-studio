import { NOTES } from "./noteMap";

export function midiToNote(
  midi
) {
  const octave =
    Math.floor(midi / 12) - 1;

  const note =
    NOTES[midi % 12];

  return `${note}${octave}`;
}

export function noteToTone(
  note
) {
  return note.replace("s", "#");
}