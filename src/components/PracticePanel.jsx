import React from "react";

function PracticePanel({
  practiceMode,
  setPracticeMode,
  detectedNote,
  expectedNotes,
  feedback,
  currentStepIndex,
}) {
  return (
    <div style={card}>
      <div style={header}>
        <h3>🎯 Practice Mode</h3>

        <button
          style={btn}
          onClick={() => setPracticeMode((p) => !p)}
        >
          {practiceMode ? "Stop" : "Start"}
        </button>
      </div>

      {practiceMode && (
        <>
          <p>🎵 Expected: {expectedNotes.join(", ") || "-"}</p>
          <p>🎤 Detected: {detectedNote || "-"}</p>

          <div style={{ marginTop: 10 }}>
            {feedback === "correct" && <span style={{ color: "#1db954" }}>🟢 Correct</span>}
            {feedback === "wrong" && <span style={{ color: "#ff4d4d" }}>🔴 Wrong</span>}
          </div>

          <p style={{ opacity: 0.6 }}>
            Step: {currentStepIndex + 1}
          </p>
        </>
      )}
    </div>
  );
}

export default PracticePanel;

/* styles */
const card = {
  background: "#1e1e1e",
  padding: 16,
  borderRadius: 12,
  marginBottom: 16,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const btn = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};