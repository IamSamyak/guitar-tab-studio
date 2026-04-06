import React from "react";
import PracticeCanvas from "./PracticeCanvas";

export default function PracticeLayout({
  steps,
  currentStepIndex,
  feedback,
  detectedNote,
  isRunning,
  setIsRunning,
  onExit,
  onExport,
}) {
  const currentStep = steps[currentStepIndex] || [];

  return (
    <div style={main}>
      {/* 🔝 Navbar */}
      <div style={nav}>
        <h2>🎸 Practice Mode</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={btn} onClick={onExport}>
            Export
          </button>

          <button
            style={btnDanger}
            onClick={() => {
              setIsRunning(false); // 🔥 stop mic
              onExit();
            }}
          >
            Exit
          </button>
        </div>
      </div>

      {/* 🎯 Controls */}
      <div style={controls}>
        {/* ▶ Start / Stop */}
        <button
          style={isRunning ? btnStop : btnStart}
          onClick={() => setIsRunning((p) => !p)}
        >
          {isRunning ? "⏹ Stop Practice" : "🎤 Start Practice"}
        </button>

        {/* 🎯 Expected Notes */}
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 6, opacity: 0.7 }}>
            Expected Notes
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {currentStep.length > 0 ? (
              currentStep.map((n, i) => (
                <div key={i} style={expectedNote}>
                  {n.note}
                </div>
              ))
            ) : (
              <div style={{ opacity: 0.5 }}>No notes</div>
            )}
          </div>
        </div>

        {/* 🎤 Detected Note */}
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 6, opacity: 0.7 }}>
            Your Input
          </div>

          <div
            style={{
              ...detectedBox,
              background:
                feedback === "correct"
                  ? "#1db954"
                  : feedback === "wrong"
                  ? "#e53935"
                  : "#222",
            }}
          >
            {detectedNote || "—"}
          </div>
        </div>

        {/* 🎯 Feedback */}
        <div style={{ marginTop: 12 }}>
          {feedback === "correct" && (
            <span style={{ color: "#1db954" }}>✔ Correct</span>
          )}
          {feedback === "wrong" && (
            <span style={{ color: "#e53935" }}>✖ Try again</span>
          )}
        </div>
      </div>

      {/* 🎼 Canvas */}
      {isRunning && (
        <PracticeCanvas
          steps={steps}
          currentStepIndex={currentStepIndex}
          feedback={feedback}
        />
      )}
    </div>
  );
}

/* =========================
   STYLES
========================= */

const main = {
  background: "#121212",
  minHeight: "100vh",
  color: "#fff",
};

const nav = {
  display: "flex",
  justifyContent: "space-between",
  padding: 16,
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const controls = {
  padding: 20,
};

const btnStart = {
  background: "#1db954",
  color: "#fff",
  padding: "10px 16px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const btnStop = {
  background: "#e53935",
  color: "#fff",
  padding: "10px 16px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const btn = {
  background: "#0051d5",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};

const btnDanger = {
  background: "#444",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
};

const expectedNote = {
  padding: "8px 12px",
  borderRadius: 8,
  background: "#333",
  fontWeight: "bold",
};

const detectedBox = {
  padding: "14px 20px",
  borderRadius: 10,
  fontSize: 24,
  fontWeight: "bold",
  minWidth: 80,
  textAlign: "center",
};