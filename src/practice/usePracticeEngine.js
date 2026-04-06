// src/practice/usePracticeEngine.js
import { useState, useEffect } from "react";
import usePitchDetection from "../hooks/usePitchDetection";
import { getExpectedNotes, isCorrectNote } from "../utils/practiceUtils";

export default function usePracticeEngine({
  steps,
  enabled,
  isRunning,
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const detectedNote = usePitchDetection(enabled && isRunning);

  useEffect(() => {
    if (!enabled || !isRunning) return;

    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const expected = getExpectedNotes(currentStep);

    if (isCorrectNote(detectedNote, expected)) {
      setFeedback("correct");

      const timeout = setTimeout(() => {
        setCurrentStepIndex((prev) => {
          if (prev + 1 >= steps.length) return prev;
          return prev + 1;
        });
        setFeedback(null);
      }, 300);

      return () => clearTimeout(timeout);
    }

    if (detectedNote) {
      setFeedback("wrong");

      const timeout = setTimeout(() => {
        setFeedback(null);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [detectedNote, enabled, isRunning, currentStepIndex, steps]);

  const reset = () => {
    setCurrentStepIndex(0);
    setFeedback(null);
  };

  return {
    detectedNote,
    currentStepIndex,
    feedback,
    reset,
  };
}