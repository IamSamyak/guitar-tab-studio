import React, { useState } from "react";

import {
  INTERVALS,
} from "../data/intervalData";

import useSequenceQuizEngine from "../hooks/useSequenceQuizEngine";

import QuizScore from "./QuizScore";

import SequenceOptions from "./SequenceOptions";

import SequenceLengthSelector from "./SequenceLengthSelector";

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
     SETUP SCREEN
  ===================================== */
  if (screen === "setup") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          padding: 20,
          display: "flex",
          flexDirection:
            "column",
          alignItems: "center",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          🔥 Sequence Interval Quiz
        </h1>

        <p
          style={{
            color: "#999",
            textAlign: "center",
            maxWidth: 500,
            lineHeight: 1.5,
            marginBottom: 30,
          }}
        >
          Advanced ear training mode.
          Listen to a sequence of
          intervals and identify the
          correct interval chain.
        </p>

        {/* MODE */}
        <div
          style={{
            width: "100%",
            maxWidth: 420,
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: 8,
              color: "#aaa",
              fontSize: 14,
            }}
          >
            Playback Mode
          </label>

          <select
            value={mode}
            onChange={(e) =>
              setMode(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              background:
                "#18181b",
              color: "#fff",
              border:
                "1px solid #3f3f46",
            }}
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
          </select>
        </div>

        {/* LENGTH */}
        <SequenceLengthSelector
          value={sequenceLength}
          onChange={
            setSequenceLength
          }
        />

        {/* DIFFICULTY LABEL */}
        <div
          style={{
            marginTop: 12,
            color: "#f59e0b",
            fontWeight: "bold",
          }}
        >
          {sequenceLength === 2 &&
            "Medium Difficulty"}

          {sequenceLength === 3 &&
            "Hard Difficulty"}

          {sequenceLength === 4 &&
            "Expert Difficulty"}

          {sequenceLength >= 5 &&
            "Insane Difficulty"}
        </div>

        {/* SELECT ALL */}
        <button
          onClick={toggleSelectAll}
          style={{
            marginTop: 20,
            padding: "10px 14px",
            background: "#2563eb",
            color: "#fff",
            borderRadius: 8,
            border: "none",
            width: "100%",
            maxWidth: 420,
            cursor: "pointer",
          }}
        >
          Select All Intervals
        </button>

        {/* INTERVAL GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: 10,
            width: "100%",
            maxWidth: 420,
            marginTop: 20,
          }}
        >
          {INTERVALS.map(
            (interval) => {
              const isSelected =
                selectedIntervals.some(
                  (i) =>
                    i.id ===
                    interval.id
                );

              return (
                <label
                  key={interval.id}
                  style={{
                    background:
                      isSelected
                        ? "#334155"
                        : "#27272a",
                    padding: 10,
                    borderRadius: 8,
                    display: "flex",
                    gap: 10,
                    alignItems:
                      "center",
                    cursor:
                      "pointer",
                    border:
                      isSelected
                        ? "1px solid #60a5fa"
                        : "1px solid transparent",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={
                      isSelected
                    }
                    onChange={() =>
                      toggleInterval(
                        interval
                      )
                    }
                  />

                  <span
                    style={{
                      color:
                        "#fff",
                      fontSize: 14,
                    }}
                  >
                    {
                      interval.label
                    }
                  </span>
                </label>
              );
            }
          )}
        </div>

        {/* VALIDATION */}
        {!isValid && (
          <p
            style={{
              color:
                "#f59e0b",
              marginTop: 12,
            }}
          >
            Select at least 2
            intervals
          </p>
        )}

        {/* START */}
        <button
          onClick={handleStart}
          disabled={!isValid}
          style={{
            marginTop: 24,
            width: "100%",
            maxWidth: 420,
            padding: 14,
            background: isValid
              ? "#22c55e"
              : "#444",
            color: "#fff",
            borderRadius: 10,
            border: "none",
            cursor: isValid
              ? "pointer"
              : "not-allowed",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Start Sequence Quiz
        </button>
      </div>
    );
  }

  /* =====================================
     QUIZ SCREEN
  ===================================== */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* TITLE */}
      <h1
        style={{
          marginBottom: 10,
        }}
      >
        🎧 Sequence Quiz Running
      </h1>

      {/* SUBTITLE */}
      <p
        style={{
          color: "#999",
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        Listen carefully and identify
        the correct interval sequence.
      </p>

      {/* BACK */}
      <button
        onClick={handleBack}
        style={{
          marginBottom: 20,
          background: "#ef4444",
          color: "#fff",
          padding: "10px 14px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
        }}
      >
        ⬅ Back to Setup
      </button>

      {/* SCORE */}
      <QuizScore
        score={score}
        total={total}
        lastResult={lastResult}
      />

      {/* OPTIONS */}
      <SequenceOptions
        options={options}
        onAnswer={
          submitAnswer
        }
      />

      {/* REPLAY */}
      <button
        onClick={replay}
        style={{
          marginTop: 24,
          background: "#2563eb",
          color: "#fff",
          padding: "12px 18px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🔊 Replay Sequence
      </button>
    </div>
  );
}

export default SequenceIntervalQuiz;