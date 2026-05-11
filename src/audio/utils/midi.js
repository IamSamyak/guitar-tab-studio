const NOTES = [
  "C",
  "Cs",
  "D",
  "Ds",
  "E",
  "F",
  "Fs",
  "G",
  "Gs",
  "A",
  "As",
  "B",
];

export function midiToNote(midi) {
  const octave = Math.floor(midi / 12) - 1;

  const note = NOTES[midi % 12];

  return `${note}${octave}`;
}