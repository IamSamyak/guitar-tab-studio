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
    if (!currentInterval || !currentPlaybackData) return;

    await playCurrent(
      currentInterval,
      currentPlaybackData
    );
  }, [currentInterval, currentPlaybackData, playCurrent]);

  /* =====================================
     NEXT QUESTION (ONLY PLACE AUDIO IS GENERATED)
  ===================================== */

  const nextQuestion = useCallback(async () => {
    if (!selectedIntervals?.length) return;

    clearPendingTimeout();

    const next = randomItem(selectedIntervals);

    setCurrentInterval(next);
    setCurrentQuestion((prev) => prev + 1);

    setSelectedAnswer(null);
    setShowFeedback(false);
    setLastResult(null);

    // 🎯 SINGLE SOURCE OF TRUTH FOR AUDIO
    const playbackData = await playCurrent(next);

    setCurrentPlaybackData(playbackData);
  }, [
    selectedIntervals,
    clearPendingTimeout,
    playCurrent,
  ]);

  /* =====================================
     START QUIZ
  ===================================== */

  const startQuiz = useCallback(async () => {
    if (!selectedIntervals || selectedIntervals.length < 2) return;

    clearPendingTimeout();

    startedRef.current = true;

    setScore(0);
    setTotal(0);
    setCurrentQuestion(1);
    setLastResult(null);
    setSessionComplete(false);
    setStatsByInterval(createStats(selectedIntervals));

    setSelectedAnswer(null);
    setShowFeedback(false);

    const first = randomItem(selectedIntervals);

    setCurrentInterval(first);

    const playbackData = await playCurrent(first);

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
      if (!currentInterval || sessionComplete || showFeedback) return false;

      const answerId =
        typeof answer === "object"
          ? answer?.id
          : answer;

      const selected =
        typeof answer === "object"
          ? answer
          : selectedIntervals.find((i) => i.id === answerId) || null;

      const correct = answerId === currentInterval.id;

      setSelectedAnswer(selected);
      setShowFeedback(true);
      setLastResult(correct);

      setTotal((prev) => prev + 1);

      if (correct) setScore((prev) => prev + 1);

      setStatsByInterval((prev) => {
        const existing = prev[currentInterval.id];
        if (!existing) return prev;

        return {
          ...prev,
          [currentInterval.id]: {
            ...existing,
            correct: existing.correct + (correct ? 1 : 0),
            wrong: existing.wrong + (correct ? 0 : 1),
          },
        };
      });

      const answeredCount = total + 1;

      if (!isInfinite && answeredCount >= sessionLength) {
        timeoutRef.current = setTimeout(() => {
          setSessionComplete(true);
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
     NEXT BUTTON AFTER FEEDBACK
  ===================================== */

  const goToNextQuestion = useCallback(() => {
    if (sessionComplete || !showFeedback) return;
    nextQuestion();
  }, [sessionComplete, showFeedback, nextQuestion]);

  /* =====================================
     FINISH
  ===================================== */

  const finishSession = useCallback(() => {
    clearPendingTimeout();
    setSessionComplete(true);
  }, [clearPendingTimeout]);

  /* =====================================
     RESET
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
     🚨 FIXED: REMOVED AUTO-REPLAY EFFECT
     (THIS WAS CAUSING DOUBLE AUDIO)
  ===================================== */

  // ❌ DO NOT auto-play on mode change anymore
  // Mode change should NOT trigger audio automatically

  /* =====================================
     CLEANUP
  ===================================== */

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /* =====================================
     ANALYSIS
  ===================================== */

  const weakIntervals = useMemo(() => {
    return Object.values(statsByInterval)
      .filter((entry) => entry.wrong > 0)
      .sort((a, b) => b.wrong - a.wrong);
  }, [statsByInterval]);

  const recommendations = useMemo(() => {
    return weakIntervals.slice(0, 3).map((entry) => {
      const count = entry.wrong;
      return `Practice ${entry.interval.label} — missed ${count} time${count > 1 ? "s" : ""}.`;
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