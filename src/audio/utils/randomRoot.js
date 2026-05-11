const ROOTS = [
  "C3",
  "D3",
  "E3",
  "F3",
  "G3",
  "A3",
  "B3",
  "C4",
];

const NOTE_INDEX = {
  C: 0,
  Cs: 1,
  D: 2,
  Ds: 3,
  E: 4,
  F: 5,
  Fs: 6,
  G: 7,
  Gs: 8,
  A: 9,
  As: 10,
  B: 11,
};

const NOTES = Object.keys(NOTE_INDEX);

function transpose(note, semitones) {
  const match = note.match(
    /^([A-G]s?)(\d)$/
  );

  if (!match) return note;

  const [, base, octaveStr] =
    match;

  let octave =
    Number(octaveStr);

  let index =
    NOTE_INDEX[base];

  index += semitones;

  while (index >= 12) {
    index -= 12;
    octave++;
  }

  while (index < 0) {
    index += 12;
    octave--;
  }

  return `${NOTES[index]}${octave}`;
}

export function getRandomRoot(
  semitones
) {
  const root =
    ROOTS[
      Math.floor(
        Math.random() *
          ROOTS.length
      )
    ];

  const target = transpose(
    root,
    semitones
  );

  return {
    root,
    target,
  };
}