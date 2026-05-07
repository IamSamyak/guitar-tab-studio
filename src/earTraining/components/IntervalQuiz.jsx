import React, { useState } from "react";

import useQuizEngine from "../hooks/useQuizEngine";

import IntervalButtons from "./IntervalButtons";

import QuizScore from "./QuizScore";

function IntervalQuiz() {
  const [mode, setMode] =
    useState("ascending");

  const {
    score,
    total,
    lastResult,
    submitAnswer,
    replay,
  } = useQuizEngine(mode);

  return (
    <div
      style={{
        padding: 20,
        color: "#fff",
      }}
    >
      <h2>🧠 Interval Quiz</h2>

      {/* MODE */}
      <div
        style={{
          marginBottom: 20,
        }}
      >
        <select
          value={mode}
          onChange={(e) =>
            setMode(e.target.value)
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
        </select>

        <button
          onClick={replay}
          style={{
            marginLeft: 12,
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          🔊 Replay
        </button>
      </div>

      {/* SCORE */}
      <QuizScore
        score={score}
        total={total}
        lastResult={lastResult}
      />

      {/* ANSWERS */}
      <IntervalButtons
        onAnswer={submitAnswer}
      />
    </div>
  );
}

export default IntervalQuiz;