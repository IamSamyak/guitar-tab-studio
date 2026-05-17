// src/features/interval-quiz/hooks/useQuizEngine.js

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

import { playInterval } from "../../../audio/interval/intervalPlayer";

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [lastResult, setLastResult] =
    useState(null);

  const [sessionComplete, setSessionComplete] =
    useState(false);

  const [statsByInterval, setStatsByInterval] =
    useState({});

  // Feedback state
  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [showFeedback, setShowFeedback] =
    useState(false);

  const [currentPlaybackData, setCurrentPlaybackData] =
    useState(null);

  const startedRef = useRef(false);
  const timeoutRef = useRef(null);

  const isInfinite =
    sessionLength === "infinite";

  /* =====================================
     CLEAR TIMEOUT
  ===================================== */

  const clearPendingTimeout =
    useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }, []);

  /* =====================================
     PLAY INTERVAL (SAFE WRAPPER)
  ===================================== */

  const playCurrent = useCallback(
    async (interval, playbackData = null) => {
      if (!interval) return null;

      try {
        return await playInterval(
          interval,
          mode,
          playbackData
        );
      } catch (error) {
        console.warn("Play failed:", error);
        return null;
      }
    },
    [mode]
  );

  /* =====================================
     REPLAY (USER ONLY)
  ===================================== */

  const replay = useCallback(async () => {
    if (!currentInterval || !currentPlaybackData)
      return;

    await playCurrent(
      currentInterval,
      currentPlaybackData
    );
  }, [
    currentInterval,
    currentPlaybackData,
    playCurrent,
  ]);

  /* =====================================
     NEXT QUESTION
  ===================================== */

  const nextQuestion = useCallback(async () => {
    // 🚨 Do not generate another question if session is complete
    if (
      sessionComplete ||
      !selectedIntervals?.length
    ) {
      return;
    }

    clearPendingTimeout();

    const next =
      randomItem(selectedIntervals);

    setCurrentInterval(next);
    setCurrentQuestion((prev) => prev + 1);

    // Reset feedback state
    setSelectedAnswer(null);
    setShowFeedback(false);
    setLastResult(null);

    // Play audio
    const playbackData =
      await playCurrent(next);

    setCurrentPlaybackData(playbackData);
  }, [
    sessionComplete,
    selectedIntervals,
    clearPendingTimeout,
    playCurrent,
  ]);

  /* =====================================
     START QUIZ
  ===================================== */

  const startQuiz = useCallback(async () => {
    if (
      !selectedIntervals ||
      selectedIntervals.length < 2
    ) {
      return;
    }

    clearPendingTimeout();

    startedRef.current = true;

    setScore(0);
    setTotal(0);

    // First question is #1
    setCurrentQuestion(1);

    setLastResult(null);
    setSessionComplete(false);
    setStatsByInterval(
      createStats(selectedIntervals)
    );

    setSelectedAnswer(null);
    setShowFeedback(false);

    const first =
      randomItem(selectedIntervals);

    setCurrentInterval(first);

    const playbackData =
      await playCurrent(first);

    setCurrentPlaybackData(playbackData);
  }, [
    selectedIntervals,
    clearPendingTimeout,
    playCurrent,
  ]);

  /* =====================================
     SUBMIT ANSWER
  ===================================== */

  const submitAnswer = useCallback(
    (answer) => {
      if (
        !currentInterval ||
        sessionComplete ||
        showFeedback
      ) {
        return false;
      }

      const answerId =
        typeof answer === "object"
          ? answer?.id
          : answer;

      const selected =
        typeof answer === "object"
          ? answer
          : selectedIntervals.find(
              (i) =>
                i.id === answerId
            ) || null;

      const correct =
        answerId === currentInterval.id;

      // Show feedback
      setSelectedAnswer(selected);
      setShowFeedback(true);
      setLastResult(correct);

      // Update score
      if (correct) {
        setScore((prev) => prev + 1);
      }

      // Update stats
      setStatsByInterval((prev) => {
        const existing =
          prev[currentInterval.id];

        if (!existing) return prev;

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

      // Update total and determine if quiz is complete
      setTotal((prevTotal) => {
        const newTotal =
          prevTotal + 1;

        if (
          !isInfinite &&
          newTotal >=
            Number(sessionLength)
        ) {
          // Mark complete immediately
          setSessionComplete(true);
        }

        return newTotal;
      });

      return correct;
    },
    [
      currentInterval,
      sessionComplete,
      showFeedback,
      selectedIntervals,
      isInfinite,
      sessionLength,
    ]
  );

  /* =====================================
     NEXT BUTTON AFTER FEEDBACK
  ===================================== */

  const goToNextQuestion =
    useCallback(() => {
      // Don't continue if:
      // - quiz is finished
      // - feedback is not showing
      if (
        sessionComplete ||
        !showFeedback
      ) {
        return;
      }

      nextQuestion();
    }, [
      sessionComplete,
      showFeedback,
      nextQuestion,
    ]);

  /* =====================================
     FINISH SESSION EARLY
  ===================================== */

  const finishSession =
    useCallback(() => {
      clearPendingTimeout();
      setSessionComplete(true);
    }, [clearPendingTimeout]);

  /* =====================================
     RESET QUIZ
  ===================================== */

  const resetQuiz = useCallback(() => {
    clearPendingTimeout();

    setCurrentInterval(null);
    setCurrentPlaybackData(null);

    setScore(0);
    setTotal(0);
    setCurrentQuestion(0);
    setLastResult(null);
    setSessionComplete(false);
    setStatsByInterval({});

    setSelectedAnswer(null);
    setShowFeedback(false);

    startedRef.current = false;
  }, [clearPendingTimeout]);

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
     WEAK INTERVALS ANALYSIS
  ===================================== */

  const weakIntervals = useMemo(() => {
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

  const recommendations = useMemo(() => {
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

  /* =====================================
     API
  ===================================== */

  return {
    currentInterval,
    currentQuestion,

    score,
    total,
    lastResult,

    sessionComplete,
    statsByInterval,
    weakIntervals,
    recommendations,

    currentPlaybackData,

    selectedAnswer,
    showFeedback,
    correctAnswer: currentInterval,

    submitAnswer,
    replay,
    nextQuestion,
    goToNextQuestion,
    startQuiz,
    finishSession,
    resetQuiz,
  };
}