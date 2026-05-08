import { useState } from "react";

import { generateSequence } from "../utils/generateSequence";

import { generateDistractors } from "../utils/generateDistractors";

import { compareSequences } from "../utils/compareSequences";

import {
  playIntervalSequence,
  stopSequencePlayback,
} from "../utils/playIntervalSequence";

function useSequenceQuizEngine(
  mode,
  selectedIntervals,
  sequenceLength
) {
  const [score, setScore] =
    useState(0);

  const [total, setTotal] =
    useState(0);

  const [lastResult, setLastResult] =
    useState(null);

  const [currentSequence, setCurrentSequence] =
    useState([]);

  const [options, setOptions] =
    useState([]);

  /* =====================================
     NEXT QUESTION
  ===================================== */
  function generateQuestion() {
    const sequence =
      generateSequence(
        selectedIntervals,
        sequenceLength
      );

    const generatedOptions =
      generateDistractors(
        sequence,
        selectedIntervals
      );

    setCurrentSequence(sequence);

    setOptions(generatedOptions);

    playIntervalSequence(
      sequence,
      mode
    );
  }

  /* =====================================
     START QUIZ
  ===================================== */
  function startQuiz() {
    setScore(0);

    setTotal(0);

    setLastResult(null);

    generateQuestion();
  }

  /* =====================================
     REPLAY
  ===================================== */
  function replay() {
    playIntervalSequence(
      currentSequence,
      mode
    );
  }

  /* =====================================
     SUBMIT ANSWER
  ===================================== */
  function submitAnswer(
    selectedSequence
  ) {
    const isCorrect =
      compareSequences(
        selectedSequence,
        currentSequence
      );

    setLastResult(isCorrect);

    setTotal((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      generateQuestion();
    }, 1200);
  }

  /* =====================================
     RESET
  ===================================== */
  function resetQuiz() {
    stopSequencePlayback();

    setScore(0);

    setTotal(0);

    setLastResult(null);

    setCurrentSequence([]);

    setOptions([]);
  }

  return {
    score,
    total,
    lastResult,
    currentSequence,
    options,
    submitAnswer,
    replay,
    startQuiz,
    resetQuiz,
  };
}

export default useSequenceQuizEngine;