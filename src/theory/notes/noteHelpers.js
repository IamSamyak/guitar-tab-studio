export function clampMidi(
  midi,
  min = 40,
  max = 80
) {
  return Math.max(
    min,
    Math.min(max, midi)
  );
}

export function transposeMidi(
  midi,
  semitones
) {
  return midi + semitones;
}