import React from "react";

export default function PracticeStats({
  detectedNote,
  feedback,
  currentStepIndex,
}) {
  return (
    <div style={card}>
      <h3>🎤 Live Feedback</h3>

      <p>Detected: {detectedNote || "-"}</p>

      <p>
        {feedback === "correct" && "🟢 Correct"}
        {feedback === "wrong" && "🔴 Wrong"}
      </p>

      <p style={{ opacity: 0.6 }}>
        Step: {currentStepIndex + 1}
      </p>
    </div>
  );
}

const card = {
  background: "#1e1e1e",
  padding: 16,
  borderRadius: 12,
  marginTop: 20,
};