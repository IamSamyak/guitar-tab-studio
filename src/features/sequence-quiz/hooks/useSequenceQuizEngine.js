import { useEffect, useState } from "react";

import { startAudio } from "../../../audio/engine/audioEngine";

import { playIntervalSequence } from "../../../audio/interval/intervalSequencePlayer";

/* =====================================
   RANDOM HELPERS
===================================== */

function randomItem(arr) {
  return arr[
    Math.floor(Math.random() * arr.length)
  ];
}

function shuffle(arr) {
  return [...arr].sort(
    () => Math.random() - 0.5
  );
}

/* =====================================
   BUILD RANDOM SEQUENCE
===================================== */

function buildSequence(
  pool,
  length
) {
  const sequence = [];

  for (let i = 0; i < length; i++) {
    sequence.push(
      randomItem(pool)
    );
  }

  return sequence;
}

/* =====================================
   LABEL
===================================== */

function sequenceLabel(sequence) {
  return sequence
    .map((i) => i.short)
    .join(" → ");
}

/* =====================================
   GENERATE OPTIONS
===================================== */

function generateOptions(
  correct,
  pool,
  length
) {
  const options = [
    {
      id: "correct",
      sequence: correct,
      label:
        sequenceLabel(correct),
      correct: true,
    },
  ];

  while (options.length < 4) {
    const seq =
      buildSequence(
        pool,
        length
      );

    const label =
      sequenceLabel(seq);

    const exists =
      options.some(
        (o) => o.label === label
      );

    if (!exists) {
      options.push({
        id: crypto.randomUUID(),
        sequence: seq,
        label,
        correct: false,
      });
    }
  }

  return shuffle(options);
}

/* =====================================
   HOOK
===================================== */

function useSequenceQuizEngine(
  mode,
  selectedIntervals,
  sequenceLength
) {
  const [score, setScore] =
    useState(0);

  const [total, setTotal] =
    useState(0);

  const [
    lastResult,
    setLastResult,
  ] = useState(null);

  const [
    currentSequence,
    setCurrentSequence,
  ] = useState([]);

  const [options, setOptions] =
    useState([]);

  /* =====================================
     PLAY CURRENT
  ===================================== */

  async function playCurrent(
    sequence
  ) {
    await startAudio();

    await playIntervalSequence(
      sequence,
      mode
    );
  }

  /* =====================================
     NEXT QUESTION
  ===================================== */

  async function nextQuestion() {
    if (
      !selectedIntervals?.length
    ) {
      return;
    }

    const sequence =
      buildSequence(
        selectedIntervals,
        sequenceLength
      );

    const generatedOptions =
      generateOptions(
        sequence,
        selectedIntervals,
        sequenceLength
      );

    setCurrentSequence(
      sequence
    );

    setOptions(
      generatedOptions
    );

    await playCurrent(sequence);
  }

  /* =====================================
     START QUIZ
  ===================================== */

  async function startQuiz() {
    setScore(0);

    setTotal(0);

    setLastResult(null);

    await nextQuestion();
  }

  /* =====================================
     SUBMIT ANSWER
  ===================================== */

  async function submitAnswer(
    option
  ) {
    const correct =
      option.correct;

    setTotal(
      (prev) => prev + 1
    );

    if (correct) {
      setScore(
        (prev) => prev + 1
      );
    }

    setLastResult(correct);

    setTimeout(async () => {
      await nextQuestion();
    }, 1200);
  }

  /* =====================================
     REPLAY
  ===================================== */

  async function replay() {
    if (
      !currentSequence?.length
    ) {
      return;
    }

    await playCurrent(
      currentSequence
    );
  }

  /* =====================================
     RESET
  ===================================== */

  function resetQuiz() {
    setScore(0);

    setTotal(0);

    setLastResult(null);

    setCurrentSequence([]);

    setOptions([]);
  }

  /* =====================================
     CLEANUP
  ===================================== */

  useEffect(() => {
    return () => {
      resetQuiz();
    };
  }, []);

  return {
    score,
    total,
    lastResult,
    options,
    submitAnswer,
    replay,
    startQuiz,
    resetQuiz,
  };
}

export default useSequenceQuizEngine;