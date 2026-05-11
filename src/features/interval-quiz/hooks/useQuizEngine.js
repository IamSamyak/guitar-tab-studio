// src/features/interval-quiz/hooks/useQuizEngine.js

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { playInterval } from "../../../audio/interval/intervalPlayer";

function randomItem(arr) {
  return arr[
    Math.floor(Math.random() * arr.length)
  ];
}

function createStats(intervals) {
  const stats = {};

  intervals.forEach((interval) => {
    stats[interval.id] = {
      interval,
      correct: 0,
      wrong: 0,
    };
  });

  return stats;
}

export default function useQuizEngine(
  mode,
  selectedIntervals,
  sessionLength = 10
) {
  const [currentInterval, setCurrentInterval] =
    useState(null);

  const [score, setScore] =
    useState(0);

  const [total, setTotal] =
    useState(0);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [lastResult, setLastResult] =
    useState(null);

  const [sessionComplete, setSessionComplete] =
    useState(false);

  const [statsByInterval, setStatsByInterval] =
    useState({});

  const startedRef = useRef(false);
  const timeoutRef = useRef(null);

  const isInfinite =
    sessionLength === "infinite";

  /* =====================================
     PLAY CURRENT
  ===================================== */

  async function playCurrent(interval) {
    if (!interval) return;

    try {
      await playInterval(interval, mode);
    } catch (error) {
      console.error(
        "Failed to play interval:",
        error
      );
    }
  }

  /* =====================================
     NEXT QUESTION
  ===================================== */

  function nextQuestion() {
    if (
      !selectedIntervals ||
      selectedIntervals.length === 0
    ) {
      return;
    }

    const next =
      randomItem(selectedIntervals);

    setCurrentInterval(next);

    setCurrentQuestion(
      (prev) => prev + 1
    );

    playCurrent(next);
  }

  /* =====================================
     START QUIZ
  ===================================== */

  function startQuiz() {
    if (
      !selectedIntervals ||
      selectedIntervals.length < 2
    ) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    startedRef.current = true;

    setScore(0);
    setTotal(0);
    setCurrentQuestion(0);
    setLastResult(null);
    setSessionComplete(false);
    setStatsByInterval(
      createStats(selectedIntervals)
    );

    const first =
      randomItem(selectedIntervals);

    setCurrentInterval(first);
    setCurrentQuestion(1);

    playCurrent(first);
  }

  /* =====================================
     REPLAY
  ===================================== */

  function replay() {
    if (!currentInterval) return;

    playCurrent(currentInterval);
  }

  /* =====================================
     ANSWER
  ===================================== */

  function submitAnswer(id) {
    if (
      !currentInterval ||
      sessionComplete
    ) {
      return;
    }

    const correct =
      id === currentInterval.id;

    setLastResult(correct);

    setTotal((prev) => prev + 1);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    setStatsByInterval((prev) => {
      const existing =
        prev[currentInterval.id];

      if (!existing) {
        return prev;
      }

      return {
        ...prev,
        [currentInterval.id]: {
          ...existing,
          correct:
            existing.correct +
            (correct ? 1 : 0),
          wrong:
            existing.wrong +
            (correct ? 0 : 1),
        },
      };
    });

    const answeredCount =
      total + 1;

    if (
      !isInfinite &&
      answeredCount >= sessionLength
    ) {
      setSessionComplete(true);
      return;
    }

    timeoutRef.current =
      setTimeout(() => {
        nextQuestion();
      }, 700);
  }

  /* =====================================
     FINISH SESSION
  ===================================== */

  function finishSession() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSessionComplete(true);
  }

  /* =====================================
     RESET
  ===================================== */

  function resetQuiz() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setCurrentInterval(null);
    setScore(0);
    setTotal(0);
    setCurrentQuestion(0);
    setLastResult(null);
    setSessionComplete(false);
    setStatsByInterval({});

    startedRef.current = false;
  }

  /* =====================================
     REPLAY WHEN MODE CHANGES
  ===================================== */

  useEffect(() => {
    if (
      startedRef.current &&
      currentInterval
    ) {
      replay();
    }
  }, [mode]);

  /* =====================================
     CLEANUP
  ===================================== */

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(
          timeoutRef.current
        );
      }
    };
  }, []);

  /* =====================================
     ANALYSIS
  ===================================== */

  const weakIntervals =
    useMemo(() => {
      return Object.values(
        statsByInterval
      )
        .filter(
          (entry) => entry.wrong > 0
        )
        .sort(
          (a, b) =>
            b.wrong - a.wrong
        );
    }, [statsByInterval]);

  const recommendations =
    useMemo(() => {
      return weakIntervals
        .slice(0, 3)
        .map((entry) => {
          const count =
            entry.wrong;

          return `Practice ${entry.interval.label} — missed ${count} time${
            count > 1 ? "s" : ""
          }.`;
        });
    }, [weakIntervals]);

  return {
    currentInterval,
    score,
    total,
    currentQuestion,
    lastResult,
    sessionComplete,
    statsByInterval,
    weakIntervals,
    recommendations,

    submitAnswer,
    replay,
    startQuiz,
    finishSession,
    resetQuiz,
  };
}