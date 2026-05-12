// src/features/interval-quiz/components/IntervalButtons.jsx

import { motion, AnimatePresence } from "framer-motion";

export default function IntervalButtons({
  options,
  onAnswer,
  selectedAnswer,
  showFeedback,
  correctAnswer,
}) {
  function getState(interval) {
    const isSelected = selectedAnswer?.id === interval.id;
    const isCorrect = correctAnswer?.id === interval.id;

    if (!showFeedback) return "idle";
    if (isCorrect) return "correct";
    if (isSelected && !isCorrect) return "wrong";
    return "dim";
  }

  const stateStyles = {
    idle: {
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.04)",
      color: "#ffffff",
      badgeBg: "rgba(255,255,255,0.06)",
      badgeColor: "rgba(255,255,255,0.35)",
      badgeBorder: "rgba(255,255,255,0.08)",
      labelOpacity: 1,
    },
    correct: {
      border: "1px solid rgba(52,211,153,0.45)",
      background: "rgba(16,185,129,0.12)",
      color: "#6ee7b7",
      badgeBg: "rgba(6,78,59,0.4)",
      badgeColor: "#6ee7b7",
      badgeBorder: "rgba(52,211,153,0.2)",
      labelOpacity: 1,
    },
    wrong: {
      border: "1px solid rgba(248,113,113,0.45)",
      background: "rgba(239,68,68,0.12)",
      color: "#fca5a5",
      badgeBg: "rgba(69,10,10,0.4)",
      badgeColor: "#fca5a5",
      badgeBorder: "rgba(248,113,113,0.2)",
      labelOpacity: 1,
    },
    dim: {
      border: "1px solid rgba(255,255,255,0.04)",
      background: "rgba(255,255,255,0.02)",
      color: "rgba(255,255,255,0.2)",
      badgeBg: "rgba(255,255,255,0.03)",
      badgeColor: "rgba(255,255,255,0.15)",
      badgeBorder: "rgba(255,255,255,0.04)",
      labelOpacity: 0.4,
    },
  };

  const stateIcons = {
    correct: "✓",
    wrong: "✗",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "0.6rem",
      }}
    >
      {options.map((interval, i) => {
        const state = getState(interval);
        const s = stateStyles[state];
        const isInteractive = !showFeedback;

        return (
          <motion.button
            key={interval.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: i * 0.04 }}
            whileHover={isInteractive ? { scale: 1.025 } : {}}
            whileTap={isInteractive ? { scale: 0.96 } : {}}
            onClick={() => !showFeedback && onAnswer(interval)}
            disabled={showFeedback}
            style={{
              position: "relative",
              overflow: "hidden",
              minHeight: 80,
              borderRadius: "1.1rem",
              border: s.border,
              background: s.background,
              color: s.color,
              padding: "0.9rem 0.85rem",
              cursor: isInteractive ? "pointer" : "default",
              textAlign: "left",
              transition: "border 0.25s, background 0.25s, color 0.25s",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* State icon badge — top right */}
            <AnimatePresence>
              {(state === "correct" || state === "wrong") && (
                <motion.div
                  key="icon"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  style={{
                    position: "absolute",
                    top: "0.6rem",
                    right: "0.7rem",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background:
                      state === "correct"
                        ? "rgba(52,211,153,0.18)"
                        : "rgba(248,113,113,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 900,
                    color: state === "correct" ? "#6ee7b7" : "#fca5a5",
                  }}
                >
                  {stateIcons[state]}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Interval label */}
            <span
              style={{
                display: "block",
                fontSize: "clamp(0.78rem, 2.5vw, 0.88rem)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
                opacity: s.labelOpacity,
                paddingRight: state !== "idle" && state !== "dim" ? "1.5rem" : 0,
                transition: "opacity 0.25s",
              }}
            >
              {interval.label}
            </span>

            {/* Semitone badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                marginTop: "0.5rem",
                padding: "0.2rem 0.55rem",
                borderRadius: 9999,
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                background: s.badgeBg,
                color: s.badgeColor,
                border: `1px solid ${s.badgeBorder}`,
                transition: "background 0.25s, color 0.25s, border 0.25s",
                width: "fit-content",
              }}
            >
              {interval.semitones} st
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}