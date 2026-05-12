// src/features/interval-quiz/components/IntervalQuiz.jsx

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import useQuizEngine from "../hooks/useQuizEngine";
import { INTERVALS } from "../../../theory/intervals/intervalData";

import IntervalButtons from "./IntervalButtons";
import QuizScore from "./QuizScore";
import ResultsScreen from "./ResultsScreen";
import IntervalQuizSetup from "./IntervalQuizSetup";

// ─────────────────────────────────────────────────────────────────────────────
// Waveform Visualizer
// ─────────────────────────────────────────────────────────────────────────────
function WaveformBars({ isPlaying }) {
  const heights = [10, 22, 34, 18, 28, 12, 26, 36, 16, 24];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 5,
        height: 40,
      }}
    >
      {heights.map((h, i) => (
        <motion.div
          key={i}
          style={{
            width: 4,
            height: h,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.4)",
            flexShrink: 0,
          }}
          animate={
            isPlaying
              ? { scaleY: [0.6, 1.4, 0.6] }
              : { scaleY: 0.35 }
          }
          transition={
            isPlaying
              ? {
                  duration: 1.1,
                  repeat: Infinity,
                  delay: i * 0.085,
                  ease: "easeInOut",
                }
              : { duration: 0.4 }
          }
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Finish Session Confirmation Sheet
// ─────────────────────────────────────────────────────────────────────────────
function FinishConfirmSheet({ onConfirm, onCancel }) {
  return (
    <motion.div
      key="finish-sheet"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "flex-end",
        background: "rgba(0,0,0,0.65)",
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          background: "#0e1018",
          borderRadius: "1.75rem 1.75rem 0 0",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
          padding: "2rem 1.5rem calc(2rem + env(safe-area-inset-bottom))",
        }}
      >
        {/* Drag pill */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.15)",
            margin: "-0.75rem auto 1.75rem",
          }}
        />

        <p
          style={{
            margin: "0 0 0.4rem",
            fontSize: "1.15rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#fff",
          }}
        >
          End this session?
        </p>
        <p
          style={{
            margin: "0 0 1.75rem",
            fontSize: "0.88rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.55,
          }}
        >
          Your progress will be saved and you'll see your results.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <motion.button
            whileTap={{ scale: 0.975 }}
            onClick={onConfirm}
            style={{
              width: "100%",
              padding: "1rem",
              border: "none",
              borderRadius: "1rem",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.75)",
              fontSize: "0.82rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            View Results
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.975 }}
            onClick={onCancel}
            style={{
              width: "100%",
              padding: "1rem",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "1rem",
              background: "transparent",
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.82rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Keep Going
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
function IntervalQuiz() {
  const [mode, setMode] = useState("ascending");
  const [screen, setScreen] = useState("setup");
  const [sessionLength, setSessionLength] = useState(10);
  const [selectedIntervals, setSelectedIntervals] = useState([]);
  const [showFinishSheet, setShowFinishSheet] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    score,
    total,
    lastResult,
    sessionComplete,
    weakIntervals,
    recommendations,
    selectedAnswer,
    showFeedback,
    correctAnswer,
    submitAnswer,
    replay,
    goToNextQuestion,
    startQuiz,
    resetQuiz,
    finishSession,
  } = useQuizEngine(mode, selectedIntervals, sessionLength);

  const isValid = selectedIntervals.length >= 2;

  useEffect(() => {
    if (screen === "quiz" && sessionComplete) {
      setScreen("results");
    }
  }, [screen, sessionComplete]);

  // ── Interval selection ──────────────────────────────────────────────────
  function toggleSelectAll() {
    setSelectedIntervals(
      selectedIntervals.length === INTERVALS.length ? [] : [...INTERVALS]
    );
  }

  function toggleInterval(interval) {
    setSelectedIntervals((prev) => {
      const exists = prev.some((i) => i.id === interval.id);
      return exists
        ? prev.filter((i) => i.id !== interval.id)
        : [...prev, interval];
    });
  }

  // ── Quiz controls ───────────────────────────────────────────────────────
  function handleStart() {
    if (!isValid) return;
    startQuiz();
    setScreen("quiz");
  }

  function handleBackToSetup() {
    resetQuiz();
    setScreen("setup");
  }

  function handleRestart() {
    startQuiz();
    setScreen("quiz");
  }

  function handleReplay() {
    setIsPlaying(true);
    replay();
    // Simulate playback duration (replace with actual audio callback)
    setTimeout(() => setIsPlaying(false), 2200);
  }

  function handleFinishConfirm() {
    setShowFinishSheet(false);
    finishSession();
  }

  // ── Progress ────────────────────────────────────────────────────────────
  const progressPercent =
    sessionLength === "infinite"
      ? 100
      : Math.min((total / sessionLength) * 100, 100);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100svh",
        width: "100%",
        overflowX: "hidden",
        color: "#ffffff",
        background:
          "radial-gradient(ellipse at top, #060a14 0%, #02040a 55%, #000000 100%)",
      }}
    >
      <AnimatePresence mode="wait">
        {/* ── SETUP SCREEN ── */}
        {screen === "setup" && (
          <IntervalQuizSetup
            selectedIntervals={selectedIntervals}
            toggleInterval={toggleInterval}
            toggleSelectAll={toggleSelectAll}
            sessionLength={sessionLength}
            setSessionLength={setSessionLength}
            mode={mode}
            setMode={setMode}
            isValid={isValid}
            handleStart={handleStart}
          />
        )}

        {/* ── QUIZ SCREEN ── */}
        {screen === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100svh",
              paddingBottom: "env(safe-area-inset-bottom, 1rem)",
            }}
          >
            {/* ── TOP BAR ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "clamp(1rem, 4vw, 1.5rem) clamp(1rem, 4vw, 1.5rem) 0",
                gap: "0.75rem",
              }}
            >
              {/* Score pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 9999,
                  padding: "0.45rem 0.9rem",
                }}
              >
                <QuizScore
                  score={score}
                  total={total}
                  lastResult={lastResult}
                  compact
                />
              </div>

              {/* Counter */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.2rem",
                  fontFamily: "monospace",
                }}
              >
                <span
                  style={{
                    fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {String(total).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                    color: "rgba(255,255,255,0.28)",
                    fontWeight: 700,
                  }}
                >
                  /
                  {sessionLength === "infinite"
                    ? "∞"
                    : String(sessionLength).padStart(2, "0")}
                </span>
              </div>

              {/* ⋯ Menu — finish session lives here */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setShowFinishSheet(true)}
                title="Session options"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.45)",
                  cursor: "pointer",
                  fontSize: "1.25rem",
                  letterSpacing: "0.05em",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ···
              </motion.button>
            </div>

            {/* ── PROGRESS BAR ── */}
            {sessionLength !== "infinite" && (
              <div
                style={{
                  height: 3,
                  margin: "0.85rem clamp(1rem,4vw,1.5rem) 0",
                  borderRadius: 9999,
                  background: "rgba(255,255,255,0.05)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.45 }}
                  style={{
                    height: "100%",
                    borderRadius: 9999,
                    background: "rgba(255,255,255,0.45)",
                  }}
                />
              </div>
            )}

            {/* ── PLAYER ── */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(2rem, 6vw, 3rem) clamp(1rem, 4vw, 1.5rem) 1.5rem",
                gap: "1.5rem",
              }}
            >
              <WaveformBars isPlaying={isPlaying} />

              <motion.button
                whileTap={{ scale: 0.91 }}
                onClick={handleReplay}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "clamp(7.5rem, 22vw, 10rem)",
                  height: "clamp(7.5rem, 22vw, 10rem)",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#ffffff",
                  fontSize: "clamp(3rem, 8vw, 4rem)",
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                🔊
              </motion.button>

              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  Tap to listen
                </p>
                <p
                  style={{
                    marginTop: "0.3rem",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  {mode}
                </p>
              </div>
            </div>

            {/* ── ANSWERS SECTION ── */}
            {/* Bottom padding expands when Next bar is visible so grid isn't hidden under it */}
            <div
              style={{
                padding: `0 clamp(1rem, 4vw, 1.5rem) ${showFeedback && !sessionComplete ? "6rem" : "1.5rem"}`,
                transition: "padding-bottom 0.25s",
              }}
            >
              <IntervalButtons
                options={selectedIntervals}
                onAnswer={submitAnswer}
                selectedAnswer={selectedAnswer}
                showFeedback={showFeedback}
                correctAnswer={correctAnswer}
              />
            </div>
          </motion.div>
        )}

        {/* ── RESULTS SCREEN ── */}
        {screen === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            style={{ width: "100%" }}
          >
            <ResultsScreen
              score={score}
              total={total}
              weakIntervals={weakIntervals}
              recommendations={recommendations}
              onRestart={handleRestart}
              onBack={handleBackToSetup}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NEXT QUESTION — fixed to bottom, always reachable ── */}
      <AnimatePresence>
        {screen === "quiz" && showFeedback && !sessionComplete && (
          <motion.div
            key="next-bar"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              padding: "0.75rem clamp(1rem, 4vw, 1.5rem) calc(0.75rem + env(safe-area-inset-bottom, 0px))",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.92) 60%, rgba(0,0,0,0))",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <motion.button
              whileTap={{ scale: 0.975 }}
              onClick={goToNextQuestion}
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "1rem",
                background: "rgba(255,255,255,0.10)",
                color: "#fff",
                fontSize: "0.82rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              Next Question
              <span style={{ opacity: 0.55, fontSize: "1rem" }}>→</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FINISH CONFIRMATION SHEET ── */}
      <AnimatePresence>
        {showFinishSheet && (
          <FinishConfirmSheet
            onConfirm={handleFinishConfirm}
            onCancel={() => setShowFinishSheet(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default IntervalQuiz;