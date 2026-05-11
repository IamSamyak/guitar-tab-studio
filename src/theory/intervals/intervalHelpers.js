export function getIntervalById(
  intervals,
  id
) {
  return intervals.find(
    (interval) => interval.id === id
  );
}

export function sortIntervals(
  intervals
) {
  return [...intervals].sort(
    (a, b) =>
      a.semitones - b.semitones
  );
}

export function filterIntervals(
  intervals,
  maxDifficulty
) {
  return intervals.filter(
    (interval) =>
      interval.difficulty <=
      maxDifficulty
  );
}