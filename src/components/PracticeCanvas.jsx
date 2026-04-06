import React from "react";

const STRINGS = ["E", "A", "D", "G", "B", "e"]; // ✅ Correct order

export default function PracticeCanvas({
  steps,
  currentStepIndex,
  feedback,
  capo = 0,
}) {
  return (
    <div style={container}>
      <div style={tabWrapper}>
        {STRINGS.map((string, stringIndex) => (
          <div key={stringIndex} style={stringRow}>
            {/* String label */}
            <div style={stringLabel}>{string} |</div>

            {/* Steps */}
            {steps.map((step, stepIndex) => {
              // ⚠️ If your data was built with old reversed indexing,
              // change this line to: (5 - stringIndex)
              const note = step.find(
                (n) => n.stringIndex === stringIndex
              );

              const isCurrent = stepIndex === currentStepIndex;
              const isPast = stepIndex < currentStepIndex;

              let color = "#aaa";
              let bg = "transparent";

              if (isCurrent && feedback === "correct") {
                bg = "#2e7d32";
                color = "#fff";
              } else if (isCurrent && feedback === "wrong") {
                bg = "#c62828";
                color = "#fff";
              } else if (isCurrent) {
                bg = "#0051d5";
                color = "#fff";
              } else if (isPast) {
                color = "#555";
              }

              const fret = note
                ? Math.max(note.fret - capo, 0)
                : "-";

              return (
                <div key={stepIndex} style={cell}>
                  {/* Vertical grid line */}
                  <div style={verticalLine} />

                  <span
                    style={{
                      ...noteStyle,
                      background: bg,
                      color,
                    }}
                  >
                    {fret}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 🎯 Playhead */}
      <div style={playhead} />
    </div>
  );
}

/* 🎨 Styles */

const container = {
  position: "relative",
  background: "#1a1a1a",
  padding: 20,
  borderRadius: 12,
  overflowX: "auto",
};

const tabWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const stringRow = {
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  padding: "4px 0",
};

const stringLabel = {
  width: 40,
  color: "#888",
  fontWeight: "bold",
};

const cell = {
  width: 50,
  textAlign: "center",
  position: "relative",
};

const verticalLine = {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: "1px",
  background: "rgba(255,255,255,0.05)",
};

const noteStyle = {
  padding: "4px 6px",
  borderRadius: 6,
  fontWeight: "bold",
  display: "inline-block",
  minWidth: 20,
};

const playhead = {
  position: "absolute",
  top: 10,
  bottom: 10,
  left: "50%",
  width: 2,
  background: "#0051d5",
};