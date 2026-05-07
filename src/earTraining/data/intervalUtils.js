export function getIntervalById(
  intervals,
  id
) {
  return intervals.find(
    (interval) => interval.id === id
  );
}

export function filterIntervals(
  intervals,
  allowedIds = []
) {
  return intervals.filter((interval) =>
    allowedIds.includes(interval.id)
  );
}

export function getIntervalLabel(
  intervals,
  id
) {
  const found = intervals.find(
    (interval) => interval.id === id
  );

  return found ? found.label : "";
}