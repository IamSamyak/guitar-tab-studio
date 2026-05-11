export function getDifficultyLabel(
  value
) {
  if (value <= 1)
    return "Easy";

  if (value <= 2)
    return "Medium";

  if (value <= 4)
    return "Hard";

  return "Extreme";
}