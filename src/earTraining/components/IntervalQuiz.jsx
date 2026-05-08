import React, { useState } from "react";

import useQuizEngine from "../hooks/useQuizEngine";
import { INTERVALS } from "../data/intervalData";

import IntervalButtons from "./IntervalButtons";
import QuizScore from "./QuizScore";

function IntervalQuiz() {
  const [mode, setMode] = useState("ascending");

  const [screen, setScreen] = useState("setup");

  const [selectedIntervals, setSelectedIntervals] = useState([]);

  const {
    score,
    total,
    lastResult,
    submitAnswer,
    replay,
    startQuiz,
    resetQuiz, // 🔥 IMPORTANT NEW
  } = useQuizEngine(mode, selectedIntervals);

  const isValid = selectedIntervals.length >= 2;

  /* =====================================
     SELECT ALL
  ===================================== */
  function toggleSelectAll() {
    if (selectedIntervals.length === INTERVALS.length) {
      setSelectedIntervals([]);
    } else {
      setSelectedIntervals([...INTERVALS]);
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
     BACK TO SETUP (NEW UX IMPROVEMENT)
  ===================================== */
  function handleBack() {
    resetQuiz();          // 🔥 stop audio + reset engine
    setScreen("setup");
  }

  const answerPool = selectedIntervals;

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
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>🧠 Interval Quiz Setup</h2>

        {/* MODE */}
        <div style={{ width: "100%", maxWidth: 420 }}>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              background: "#18181b",
              color: "#fff",
              border: "1px solid #3f3f46",
            }}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
            <option value="harmonic">Harmonic</option>
          </select>
        </div>

        {/* SELECT ALL */}
        <button
          onClick={toggleSelectAll}
          style={{
            marginTop: 15,
            padding: "10px 14px",
            background: "#3b82f6",
            color: "#fff",
            borderRadius: 8,
            border: "none",
            width: "100%",
            maxWidth: 420,
          }}
        >
          Select All
        </button>

        {/* INTERVALS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            width: "100%",
            maxWidth: 420,
            marginTop: 20,
          }}
        >
          {INTERVALS.map((interval) => {
            const isSelected = selectedIntervals.some(
              (i) => i.id === interval.id
            );

            return (
              <label
                key={interval.id}
                style={{
                  background: isSelected ? "#334155" : "#27272a",
                  padding: 10,
                  borderRadius: 8,
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
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
                  }}
                />

                <span style={{ color: "#fff", fontSize: 14 }}>
                  {interval.label}
                </span>
              </label>
            );
          })}
        </div>

        {!isValid && (
          <p style={{ color: "orange", marginTop: 10 }}>
            Select at least 2 intervals
          </p>
        )}

        {/* START */}
        <button
          onClick={handleStart}
          disabled={!isValid}
          style={{
            marginTop: 20,
            width: "100%",
            maxWidth: 420,
            padding: 12,
            background: isValid ? "#22c55e" : "#444",
            color: "#fff",
            borderRadius: 8,
            border: "none",
          }}
        >
          Start Quiz
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
      <h2>🎧 Quiz Running</h2>

      {/* BACK BUTTON */}
      <button
        onClick={handleBack}
        style={{
          marginBottom: 15,
          background: "#ef4444",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: 8,
          border: "none",
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

      {/* ANSWERS */}
      <IntervalButtons
        onAnswer={submitAnswer}
        options={answerPool}
      />

      {/* REPLAY */}
      <button
        onClick={replay}
        style={{
          marginTop: 20,
          background: "#2563eb",
          color: "#fff",
          padding: 10,
          borderRadius: 8,
        }}
      >
        🔊 Replay
      </button>
    </div>
  );
}

export default IntervalQuiz;