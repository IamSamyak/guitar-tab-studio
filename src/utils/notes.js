const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E",
  "F", "F#", "G", "G#", "A", "A#", "B"
];

export function getNoteName(rootNoteIndex, fret, capo = 0) {
  const totalSemitones = rootNoteIndex + fret + capo;

  const noteIndex = totalSemitones % 12;
  const octave = Math.floor(totalSemitones / 12) + 2; 
  // +2 because low E string starts at E2

  return `${NOTE_NAMES[noteIndex]}${octave}`;
}