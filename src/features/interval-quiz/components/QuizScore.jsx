// src/features/interval-quiz/components/QuizScore.jsx

import { motion, AnimatePresence } from "framer-motion";

export default function QuizScore({
  score,
  total,
  lastResult,
  compact = false,
}) {
  const accuracy =
    total === 0 ? 0 : Math.round((score / total) * 100);

  // ── Compact pill mode (used in top bar) ──────────────────────────────────
  if (compact) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        {/* Last result dot */}
        <AnimatePresence mode="wait">
          {lastResult !== null && (
            <motion.div
              key={String(lastResult) + total}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background:
                  lastResult
                    ? "rgba(52,211,153,0.9)"
                    : "rgba(248,113,113,0.9)",
                flexShrink: 0,
              }}
            />
          )}
        </AnimatePresence>

        {/* Score fraction */}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.75)",
            letterSpacing: "0.04em",
          }}
        >
          {score}
          <span style={{ color: "rgba(255,255,255,0.28)" }}>/{total}</span>
        </span>

        {/* Accuracy */}
        {total > 0 && (
          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.04em",
            }}
          >
            · {accuracy}%
          </span>
        )}
      </div>
    );
  }

  // ── Full card mode (legacy / optional standalone use) ───────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: "1.5rem",
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "1.25rem 1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Score number */}
        <div>
          <p
            style={{
              margin: 0,
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Score
          </p>

          <div
            style={{
              marginTop: "0.35rem",
              fontFamily: "monospace",
              fontSize: "clamp(2.4rem, 7vw, 3.2rem)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {score}
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.6em" }}>
              /{total}
            </span>
          </div>
        </div>

        {/* Accuracy ring */}
        <div
          style={{
            position: "relative",
            width: "clamp(4rem,12vw,5rem)",
            height: "clamp(4rem,12vw,5rem)",
            flexShrink: 0,
          }}
        >
          <svg
            viewBox="0 0 56 56"
            style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}
          >
            <circle
              cx="28" cy="28" r="22"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="5"
            />
            <motion.circle
              cx="28" cy="28" r="22"
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 22}`}
              animate={{
                strokeDashoffset: `${2 * Math.PI * 22 * (1 - accuracy / 100)}`,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "monospace",
              fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)",
              fontWeight: 900,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {accuracy}%
          </div>
        </div>
      </div>

      {/* Last result feedback strip */}
      <AnimatePresence mode="wait">
        {lastResult !== null && (
          <motion.div
            key={String(lastResult) + total}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              borderRadius: "0.85rem",
              padding: "0.65rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: lastResult
                ? "rgba(16,185,129,0.1)"
                : "rgba(239,68,68,0.1)",
              border: lastResult
                ? "1px solid rgba(52,211,153,0.2)"
                : "1px solid rgba(248,113,113,0.2)",
            }}
          >
            <motion.span
              key={String(lastResult)}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: lastResult
                  ? "rgba(52,211,153,0.2)"
                  : "rgba(248,113,113,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                fontWeight: 900,
                color: lastResult ? "#6ee7b7" : "#fca5a5",
                flexShrink: 0,
              }}
            >
              {lastResult ? "✓" : "✗"}
            </motion.span>

            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: lastResult
                  ? "rgba(110,231,183,0.85)"
                  : "rgba(252,165,165,0.85)",
              }}
            >
              {lastResult ? "Correct" : "Incorrect"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}