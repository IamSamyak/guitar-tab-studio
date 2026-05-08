import {
  useState,
  useRef,
  useCallback,
} from "react";

import {
  generateQuestion,
  checkAnswer,
} from "../services/quizEngine";

import { playInterval } from "../services/intervalPlayer";

function useQuizEngine(mode = "ascending", selectedIntervals = null) {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [lastResult, setLastResult] = useState(null);

  const busyRef = useRef(false);
  const startedRef = useRef(false);

  /* =====================================
     AUDIO PLAYER
  ===================================== */
  const playQuestion = useCallback(
    async (question) => {
      if (!startedRef.current) {
        console.log("🚫 Not started yet");
        return;
      }

      if (!question) {
        console.log("🚫 No question");
        return;
      }

      if (busyRef.current) {
        console.log("⏳ Busy skipping audio");
        return;
      }

      busyRef.current = true;

      console.log("🎧 Playing:", question);

      try {
        await playInterval(question, mode);
      } catch (err) {
        console.error("❌ Playback error:", err);
      }

      setTimeout(() => {
        busyRef.current = false;
      }, 1200);
    },
    [mode]
  );

  /* =====================================
     GENERATE QUESTION
  ===================================== */
  const nextQuestion = useCallback(() => {
    if (!startedRef.current) {
      console.log("🚫 Quiz not started");
      return;
    }

    if (!selectedIntervals || selectedIntervals.length < 2) {
      console.log("🚫 Invalid interval selection");
      return;
    }

    const question = generateQuestion(selectedIntervals);

    console.log("🎯 Generated:", question);

    setCurrentQuestion(question);

    playQuestion(question);
  }, [playQuestion, selectedIntervals]);

  /* =====================================
     START QUIZ
  ===================================== */
  const startQuiz = useCallback(() => {
    if (!selectedIntervals || selectedIntervals.length < 2) {
      console.log("🚫 Select at least 2 intervals");
      return;
    }

    console.log("🚀 START QUIZ");

    startedRef.current = true;

    setScore(0);
    setTotal(0);
    setLastResult(null);

    nextQuestion();
  }, [nextQuestion, selectedIntervals]);

  /* =====================================
     RESET QUIZ (NEW IMPORTANT)
  ===================================== */
  const resetQuiz = useCallback(() => {
    console.log("🔄 RESET QUIZ");

    startedRef.current = false;

    setCurrentQuestion(null);
    setScore(0);
    setTotal(0);
    setLastResult(null);
  }, []);

  /* =====================================
     SUBMIT ANSWER
  ===================================== */
  const submitAnswer = useCallback(
    (answerId) => {
      if (!startedRef.current || !currentQuestion) {
        console.log("🚫 Cannot answer yet");
        return;
      }

      const correct = checkAnswer(currentQuestion, answerId);

      console.log("📩 Answer:", answerId, "Correct:", correct);

      setLastResult(correct);
      setTotal((t) => t + 1);

      if (correct) {
        setScore((s) => s + 1);
      }

      setTimeout(() => {
        nextQuestion();
      }, 1000);
    },
    [currentQuestion, nextQuestion]
  );

  /* =====================================
     REPLAY
  ===================================== */
  const replay = useCallback(() => {
    if (!startedRef.current) {
      console.log("🚫 Quiz not started");
      return;
    }

    if (!currentQuestion) {
      console.log("🚫 No question");
      return;
    }

    console.log("🔁 Replay:", currentQuestion);

    playQuestion(currentQuestion);
  }, [currentQuestion, playQuestion]);

  return {
    currentQuestion,
    score,
    total,
    lastResult,

    submitAnswer,
    replay,
    startQuiz,
    resetQuiz, // 🔥 NEW

    isStarted: startedRef.current,
  };
}

export default useQuizEngine;