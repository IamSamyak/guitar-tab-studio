import React, { useState, useEffect } from "react";
import PracticeLayout from "../components/PracticeLayout";
import usePracticeEngine from "./usePracticeEngine";

export default function PracticeContainer({
  steps,
  onExit,
  onExport,
}) {
  const [isRunning, setIsRunning] = useState(false);

  const {
    detectedNote,
    currentStepIndex,
    feedback,
    expectedNotes,
    reset,
  } = usePracticeEngine({
    steps,
    enabled: true,       // hook is mounted
    isRunning,           // 🎤 controls mic ON/OFF
  });

  /* ===============================
     🔄 RESET WHEN STOPPED
  =============================== */
  useEffect(() => {
    if (!isRunning) {
      reset();
    }
  }, [isRunning, reset]);

  /* ===============================
     🚪 EXIT HANDLER
  =============================== */
  const handleExit = () => {
    setIsRunning(false);
    reset();
    onExit();
  };

  return (
    <PracticeLayout
      steps={steps}
      currentStepIndex={currentStepIndex}
      feedback={feedback}
      detectedNote={detectedNote}
      expectedNotes={expectedNotes}   // ✅ NEW (for UI feedback)
      isRunning={isRunning}
      setIsRunning={setIsRunning}
      onExit={handleExit}
      onExport={onExport}
    />
  );
}