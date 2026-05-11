// src/features/practice/components/PracticeContainer.jsx

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";

import {
  playTab,
} from "../../../features/tab-editor/services/tabPlaybackService";

function PracticeContainer({
  steps = [],
  tempo = 90,
  playMode = "chord",
}) {
  const [currentStep, setCurrentStep] =
    useState(0);

  const [completedSteps, setCompletedSteps] =
    useState([]);

  const [isPlaying, setIsPlaying] =
    useState(false);

  /* =====================================
     TOTAL
  ===================================== */
  const totalSteps =
    steps.length;

  const progress =
    totalSteps === 0
      ? 0
      : Math.round(
          (completedSteps.length /
            totalSteps) *
            100
        );

  /* =====================================
     CURRENT STEP
  ===================================== */
  const activeStep =
    useMemo(() => {
      return (
        steps[currentStep] || []
      );
    }, [steps, currentStep]);

  /* =====================================
     PLAY CURRENT STEP
  ===================================== */
  async function handlePlayStep() {
    if (!activeStep?.length)
      return;

    try {
      setIsPlaying(true);

      await playTab(
        [
          {
            name: "Practice",
            steps: [activeStep],
          },
        ],
        tempo,
        playMode
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsPlaying(false);
      }, 1200);
    }
  }

  /* =====================================
     NEXT STEP
  ===================================== */
  function nextStep() {
    if (
      currentStep >=
      totalSteps - 1
    ) {
      return;
    }

    if (
      !completedSteps.includes(
        currentStep
      )
    ) {
      setCompletedSteps((prev) => [
        ...prev,
        currentStep,
      ]);
    }

    setCurrentStep((prev) => prev + 1);
  }

  /* =====================================
     PREVIOUS STEP
  ===================================== */
  function previousStep() {
    if (currentStep <= 0)
      return;

    setCurrentStep((prev) => prev - 1);
  }

  /* =====================================
     RESET
  ===================================== */
  function resetPractice() {
    setCurrentStep(0);

    setCompletedSteps([]);
  }

  /* =====================================
     AUTO COMPLETE LAST STEP
  ===================================== */
  useEffect(() => {
    if (
      currentStep ===
        totalSteps - 1 &&
      totalSteps > 0
    ) {
      if (
        !completedSteps.includes(
          currentStep
        )
      ) {
        setCompletedSteps((prev) => [
          ...prev,
          currentStep,
        ]);
      }
    }
  }, [
    currentStep,
    totalSteps,
    completedSteps,
  ]);

  /* =====================================
     EMPTY
  ===================================== */
  if (!steps?.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-xl p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold">
            🎯 Practice Mode
          </h2>

          <p className="text-zinc-400">
            No practice steps found.
            Create some tab steps in
            the editor first.
          </p>
        </Card>
      </div>
    );
  }

  /* =====================================
     UI
  ===================================== */
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* HEADER */}
      <Card className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              🎯 Practice Mode
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              Practice your saved tab
              steps interactively.
            </p>
          </div>

          <div className="rounded-xl bg-zinc-800 px-4 py-3 text-sm">
            Progress:{" "}
            <span className="font-bold text-white">
              {progress}%
            </span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </Card>

      {/* STEP CARD */}
      <Card className="p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-zinc-400">
              Current Step
            </p>

            <h2 className="text-2xl font-bold">
              {currentStep + 1} /{" "}
              {totalSteps}
            </h2>
          </div>

          <div className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300">
            Notes:{" "}
            <span className="font-semibold text-white">
              {
                activeStep.length
              }
            </span>
          </div>
        </div>

        {/* NOTES */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {activeStep.map(
            (note, index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <p className="text-xs text-zinc-500">
                  String
                </p>

                <p className="mb-2 text-lg font-semibold text-white">
                  {note.string}
                </p>

                <p className="text-xs text-zinc-500">
                  Fret
                </p>

                <p className="text-lg font-semibold text-blue-400">
                  {note.fret}
                </p>
              </div>
            )
          )}
        </div>

        {/* CONTROLS */}
        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <Button
            onClick={
              previousStep
            }
            disabled={
              currentStep === 0
            }
            className="w-full md:w-auto"
          >
            ← Previous
          </Button>

          <Button
            onClick={
              handlePlayStep
            }
            disabled={isPlaying}
            className="w-full bg-blue-600 hover:bg-blue-500 md:w-auto"
          >
            {isPlaying
              ? "Playing..."
              : "🔊 Play Step"}
          </Button>

          <Button
            onClick={nextStep}
            disabled={
              currentStep ===
              totalSteps - 1
            }
            className="w-full bg-green-600 hover:bg-green-500 md:w-auto"
          >
            Next →
          </Button>

          <Button
            onClick={
              resetPractice
            }
            className="w-full bg-red-600 hover:bg-red-500 md:ml-auto md:w-auto"
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* STEP NAVIGATION */}
      <Card className="p-5">
        <h3 className="mb-4 text-lg font-semibold">
          Steps Overview
        </h3>

        <div className="flex flex-wrap gap-3">
          {steps.map(
            (_, index) => {
              const isActive =
                index ===
                currentStep;

              const isCompleted =
                completedSteps.includes(
                  index
                );

              return (
                <button
                  key={index}
                  onClick={() =>
                    setCurrentStep(
                      index
                    )
                  }
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                      ? "bg-green-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {index + 1}
                </button>
              );
            }
          )}
        </div>
      </Card>
    </div>
  );
}

export default PracticeContainer;