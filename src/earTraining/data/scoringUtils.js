export function calculateAccuracy(
  score,
  total
) {
  if (total === 0) return 0;

  return Math.round((score / total) * 100);
}

export function getScoreMessage(
  accuracy
) {
  if (accuracy >= 90) {
    return "Excellent Ear 👏";
  }

  if (accuracy >= 75) {
    return "Very Good 🔥";
  }

  if (accuracy >= 60) {
    return "Good Progress 🎸";
  }

  if (accuracy >= 40) {
    return "Keep Practicing 🎧";
  }

  return "Train Slower Intervals First";
}