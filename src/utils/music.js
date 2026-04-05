const STRING_BASE_FREQUENCIES = [
  82.41,
  110.0,
  146.83,
  196.0,
  246.94,
  329.63
];

export function getFrequency(stringIndex, fret, capo = 0) {
  const baseFreq = STRING_BASE_FREQUENCIES[stringIndex];
  const semitones = fret + capo;

  return baseFreq * Math.pow(2, semitones / 12);
}