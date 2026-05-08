import { INTERVALS } from "../data/intervalData";

export function generateQuestion(selectedIntervals = null) {
  const pool =
    selectedIntervals && selectedIntervals.length >= 2
      ? selectedIntervals
      : INTERVALS;

  const randomIndex = Math.floor(Math.random() * pool.length);

  return pool[randomIndex];
}

export function checkAnswer(currentInterval, selectedAnswer) {
  if (!currentInterval) return false;

  return currentInterval.id === selectedAnswer;
}