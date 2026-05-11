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

function midiToNote(midi) {
  const octave = Math.floor(midi / 12) - 1;
  const note = NOTES[midi % 12];

  return `${note}${octave}`;
}

export function getRandomRoot(semitones) {
  const min = 48; // C3
  const max = 72 - semitones;

  const rootMidi =
    Math.floor(Math.random() * (max - min)) + min;

  const targetMidi = rootMidi + semitones;

  return {
    root: midiToNote(rootMidi),
    target: midiToNote(targetMidi),
  };
}