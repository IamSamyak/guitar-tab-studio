export function compareSequences(
  a,
  b
) {
  if (!a || !b) return false;

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id) {
      return false;
    }
  }

  return true;
}