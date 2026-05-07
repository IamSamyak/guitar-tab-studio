import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import {
  generateQuestion,
  checkAnswer,
} from "../services/quizEngine";

import {
  playInterval,
} from "../services/intervalPlayer";

function useQuizEngine(
  mode = "ascending"
) {
  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(null);

  const [score, setScore] =
    useState(0);

  const [total, setTotal] =
    useState(0);

  const [
    lastResult,
    setLastResult,
  ] = useState(null);

  /* =====================================
     STRICT MODE FIX
  ===================================== */
  const initialized =
    useRef(false);

  const busyRef =
    useRef(false);

  /* =====================================
     NEXT QUESTION
  ===================================== */
  const nextQuestion =
    useCallback(async () => {
      // prevent overlapping playback
      if (busyRef.current) {
        return;
      }

      busyRef.current = true;

      try {
        const question =
          generateQuestion();

        setCurrentQuestion(
          question
        );

        await playInterval(
          question,
          mode
        );
      } catch (err) {
        console.error(
          "Quiz playback error",
          err
        );
      }

      // allow next playback later
      setTimeout(() => {
        busyRef.current = false;
      }, 1500);
    }, [mode]);

  /* =====================================
     START FIRST QUESTION
  ===================================== */
  useEffect(() => {
    // prevent React strict mode
    // double execution
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    const timer =
      setTimeout(() => {
        nextQuestion();
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [nextQuestion]);

  /* =====================================
     SUBMIT ANSWER
  ===================================== */
  const submitAnswer =
    useCallback(
      async (answerId) => {
        if (!currentQuestion)
          return;

        const correct =
          checkAnswer(
            currentQuestion,
            answerId
          );

        setLastResult(correct);

        setTotal(
          (prev) => prev + 1
        );

        if (correct) {
          setScore(
            (prev) => prev + 1
          );
        }

        // wait before next playback
        setTimeout(() => {
          nextQuestion();
        }, 1200);
      },
      [currentQuestion, nextQuestion]
    );

  /* =====================================
     REPLAY CURRENT
  ===================================== */
  const replay =
    useCallback(async () => {
      if (
        !currentQuestion ||
        busyRef.current
      ) {
        return;
      }

      busyRef.current = true;

      try {
        await playInterval(
          currentQuestion,
          mode
        );
      } catch (err) {
        console.error(
          "Replay error",
          err
        );
      }

      setTimeout(() => {
        busyRef.current = false;
      }, 1500);
    }, [currentQuestion, mode]);

  return {
    currentQuestion,
    score,
    total,
    lastResult,
    submitAnswer,
    replay,
  };
}

export default useQuizEngine;