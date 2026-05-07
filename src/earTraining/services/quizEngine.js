import { INTERVALS } from "../data/intervalData";

export function generateQuestion() {
  const randomIndex = Math.floor(
    Math.random() * INTERVALS.length
  );

  return INTERVALS[randomIndex];
}

export function checkAnswer(
  currentInterval,
  selectedAnswer
) {
  if (!currentInterval) return false;

  return currentInterval.id === selectedAnswer;
}