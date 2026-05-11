// src/features/sequence-quiz/components/SequenceIntervalQuiz.jsx

import React, { useState } from "react";

import {
  INTERVALS,
} from "../../../theory/intervals/intervalData";

import useSequenceQuizEngine from "../hooks/useSequenceQuizEngine";

import QuizScore from "../../interval-quiz/components/QuizScore";

import SequenceOptions from "./SequenceOptions";

import SequenceLengthSelector from "./SequenceLengthSelector";

import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import Select from "../../../shared/ui/Select";
import ScreenContainer from "../../../shared/ui/ScreenContainer";

function SequenceIntervalQuiz() {
  const [mode, setMode] =
    useState("ascending");

  const [screen, setScreen] =
    useState("setup");

  const [
    selectedIntervals,
    setSelectedIntervals,
  ] = useState([]);

  const [
    sequenceLength,
    setSequenceLength,
  ] = useState(3);

  const {
    score,
    total,
    lastResult,
    options,
    submitAnswer,
    replay,
    startQuiz,
    resetQuiz,
  } = useSequenceQuizEngine(
    mode,
    selectedIntervals,
    sequenceLength
  );

  const isValid =
    selectedIntervals.length >= 2;

  /* =====================================
     SELECT ALL
  ===================================== */
  function toggleSelectAll() {
    if (
      selectedIntervals.length ===
      INTERVALS.length
    ) {
      setSelectedIntervals([]);
    } else {
      setSelectedIntervals([
        ...INTERVALS,
      ]);
    }
  }

  /* =====================================
     TOGGLE INTERVAL
  ===================================== */
  function toggleInterval(interval) {
    setSelectedIntervals((prev) => {
      const exists = prev.some(
        (i) => i.id === interval.id
      );

      if (exists) {
        return prev.filter(
          (i) => i.id !== interval.id
        );
      }

      return [...prev, interval];
    });
  }

  /* =====================================
     START QUIZ
  ===================================== */
  function handleStart() {
    if (!isValid) return;

    startQuiz();

    setScreen("quiz");
  }

  /* =====================================
     BACK TO SETUP
  ===================================== */
  function handleBack() {
    resetQuiz();

    setScreen("setup");
  }

  /* =====================================
     DIFFICULTY LABEL
  ===================================== */
  function getDifficultyLabel() {
    if (sequenceLength === 2) {
      return "Medium Difficulty";
    }

    if (sequenceLength === 3) {
      return "Hard Difficulty";
    }

    if (sequenceLength === 4) {
      return "Expert Difficulty";
    }

    return "Insane Difficulty";
  }

  /* =====================================
     SETUP SCREEN
  ===================================== */
  if (screen === "setup") {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <div className="w-full max-w-3xl">
          {/* HEADER */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">
              🔥 Sequence Interval Quiz
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">
              Advanced ear training
              mode. Listen carefully to
              interval chains and
              identify the correct
              sequence.
            </p>
          </div>

          {/* SETUP CARD */}
          <Card className="space-y-6 p-5 md:p-6">
            {/* PLAYBACK MODE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Playback Mode
              </label>

              <Select
                value={mode}
                onChange={(e) =>
                  setMode(
                    e.target.value
                  )
                }
              >
                <option value="ascending">
                  Ascending
                </option>

                <option value="descending">
                  Descending
                </option>

                <option value="harmonic">
                  Harmonic
                </option>
              </Select>
            </div>

            {/* LENGTH */}
            <div>
              <SequenceLengthSelector
                value={
                  sequenceLength
                }
                onChange={
                  setSequenceLength
                }
              />

              <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-center text-sm font-semibold text-amber-400">
                {getDifficultyLabel()}
              </div>
            </div>

            {/* SELECT ALL */}
            <Button
              onClick={
                toggleSelectAll
              }
              className="w-full"
            >
              {selectedIntervals.length ===
              INTERVALS.length
                ? "Clear All"
                : "Select All Intervals"}
            </Button>

            {/* INTERVAL GRID */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {INTERVALS.map(
                (interval) => {
                  const isSelected =
                    selectedIntervals.some(
                      (i) =>
                        i.id ===
                        interval.id
                    );

                  return (
                    <button
                      key={
                        interval.id
                      }
                      onClick={() =>
                        toggleInterval(
                          interval
                        )
                      }
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/20"
                          : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          isSelected
                        }
                        readOnly
                      />

                      <div>
                        <p className="font-medium text-white">
                          {
                            interval.label
                          }
                        </p>

                        <p className="text-xs text-zinc-400">
                          {
                            interval.semitones
                          }{" "}
                          semitones
                        </p>
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* VALIDATION */}
            {!isValid && (
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-400">
                Select at least 2
                intervals to begin.
              </div>
            )}

            {/* START */}
            <Button
              onClick={
                handleStart
              }
              disabled={!isValid}
              className="w-full bg-green-600 hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Start Sequence Quiz
            </Button>
          </Card>
        </div>
      </ScreenContainer>
    );
  }

  /* =====================================
     QUIZ SCREEN
  ===================================== */
  return (
    <ScreenContainer className="flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              🎧 Sequence Quiz Running
            </h1>

            <p className="mt-1 text-sm text-zinc-400">
              Listen carefully and
              identify the correct
              interval chain.
            </p>
          </div>

          <Button
            onClick={handleBack}
            className="bg-red-600 hover:bg-red-500"
          >
            ← Back to Setup
          </Button>
        </div>

        {/* SCORE */}
        <div className="mb-6">
          <QuizScore
            score={score}
            total={total}
            lastResult={
              lastResult
            }
          />
        </div>

        {/* OPTIONS */}
        <Card className="p-5">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Choose Sequence
              </h2>

              <p className="text-sm text-zinc-400">
                Pick the correct
                interval chain from
                the options below.
              </p>
            </div>

            <div className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300">
              Length:{" "}
              <span className="font-semibold text-white">
                {sequenceLength}
              </span>
            </div>
          </div>

          <SequenceOptions
            options={options}
            onAnswer={
              submitAnswer
            }
          />
        </Card>

        {/* REPLAY */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={replay}
            className="bg-blue-600 hover:bg-blue-500"
          >
            🔊 Replay Sequence
          </Button>
        </div>
      </div>
    </ScreenContainer>
  );
}

export default SequenceIntervalQuiz;