const NOTES = [
  "A2",
  "As2",
  "B2",

  "C3",
  "Cs3",
  "D3",
  "Ds3",
  "E3",
  "F3",
  "Fs3",
  "G3",
  "Gs3",
  "A3",
  "As3",
  "B3",

  "C4",
  "Cs4",
  "D4",
  "Ds4",
  "E4",
  "F4",
  "Fs4",
  "G4",
  "Gs4",
  "A4",
  "As4",
  "B4",

  "C5",
  "Cs5",
  "D5",
];

/* =====================================
   GET SAFE RANDOM ROOT
===================================== */
export function getRandomRoot(
  semitones
) {
  // prevent overflow

  const maxIndex =
    NOTES.length -
    1 -
    semitones;

  const randomIndex =
    Math.floor(
      Math.random() *
        (maxIndex + 1)
    );

  const root =
    NOTES[randomIndex];

  const target =
    NOTES[
      randomIndex +
        semitones
    ];

  return {
    root,
    target,
  };
}