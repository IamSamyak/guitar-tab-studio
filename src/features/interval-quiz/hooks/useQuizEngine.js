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
        clearTimeout(
          timeoutRef.current
        );
        timeoutRef.current = null;
      }
    }, []);

  /* =====================================
     PLAY CURRENT INTERVAL
  ===================================== */

  const playCurrent = useCallback(
    async (interval) => {
      if (!interval) return;

      try {
        await playInterval(
          interval,
          mode
        );
      } catch (error) {
        console.warn(
          "Failed to play interval:",
          error
        );

        // Retry once after short delay
        setTimeout(() => {
          playInterval(
            interval,
            mode
          ).catch((retryError) => {
            console.error(
              "Retry failed:",
              retryError
            );
          });
        }, 250);
      }
    },
    [mode]
  );

  /* =====================================
     REPLAY SAME INTERVAL
  ===================================== */

  const replay = useCallback(() => {
    if (!currentInterval) return;
    playCurrent(currentInterval);
  }, [currentInterval, playCurrent]);

  /* =====================================
     LOAD NEXT QUESTION
  ===================================== */

  const nextQuestion =
    useCallback(() => {
      if (
        !selectedIntervals ||
        selectedIntervals.length === 0
      ) {
        return;
      }

      clearPendingTimeout();

      const next = randomItem(
        selectedIntervals
      );

      setCurrentInterval(next);
      setCurrentQuestion(
        (prev) => prev + 1
      );

      // Reset feedback
      setSelectedAnswer(null);
      setShowFeedback(false);
      setLastResult(null);

      playCurrent(next);
    }, [
      selectedIntervals,
      clearPendingTimeout,
      playCurrent,
    ]);

  /* =====================================
     START QUIZ
  ===================================== */

  const startQuiz = useCallback(() => {
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
    setCurrentQuestion(1);
    setLastResult(null);
    setSessionComplete(false);
    setStatsByInterval(
      createStats(selectedIntervals)
    );

    // Reset feedback
    setSelectedAnswer(null);
    setShowFeedback(false);

    const first = randomItem(
      selectedIntervals
    );

    setCurrentInterval(first);

    playCurrent(first);
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

      // Supports interval object or id
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
        answerId ===
        currentInterval.id;

      // Show feedback
      setSelectedAnswer(selected);
      setShowFeedback(true);
      setLastResult(correct);

      // Update totals
      setTotal((prev) => prev + 1);

      if (correct) {
        setScore((prev) => prev + 1);
      }

      // Update stats
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

      // Session complete
      if (
        !isInfinite &&
        answeredCount >=
          sessionLength
      ) {
        timeoutRef.current =
          setTimeout(() => {
            setSessionComplete(
              true
            );
          }, 1200);
      }

      return correct;
    },
    [
      currentInterval,
      sessionComplete,
      showFeedback,
      selectedIntervals,
      total,
      isInfinite,
      sessionLength,
    ]
  );

  /* =====================================
     MANUAL NEXT QUESTION
  ===================================== */

  const goToNextQuestion =
    useCallback(() => {
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
     FINISH SESSION
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
     REPLAY WHEN MODE CHANGES
  ===================================== */

  useEffect(() => {
    if (
      startedRef.current &&
      currentInterval
    ) {
      replay();
    }
  }, [
    mode,
    replay,
    currentInterval,
  ]);

  /* =====================================
     CLEANUP
  ===================================== */

  useEffect(() => {
    return () => {
      const timeoutId =
        timeoutRef.current;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  /* =====================================
     ANALYSIS
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

  /* =====================================
     RETURN API
  ===================================== */

  return {
    // Current question
    currentInterval,
    currentQuestion,

    // Score
    score,
    total,
    lastResult,

    // Session state
    sessionComplete,
    statsByInterval,
    weakIntervals,
    recommendations,

    // Feedback state
    selectedAnswer,
    showFeedback,
    correctAnswer: currentInterval,

    // Actions
    submitAnswer,
    replay,
    nextQuestion,
    goToNextQuestion,
    startQuiz,
    finishSession,
    resetQuiz,
  };
}