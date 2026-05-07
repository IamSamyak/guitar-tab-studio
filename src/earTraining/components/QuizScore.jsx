import React from "react";

function QuizScore({
  score,
  total,
  lastResult,
}) {
  const percentage =
    total === 0
      ? 0
      : Math.round((score / total) * 100);

  return (
    <div
      style={{
        background: "#1e1e1e",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
      }}
    >
      <h3>🎯 Quiz Score</h3>

      <div
        style={{
          fontSize: 20,
          marginTop: 10,
        }}
      >
        {score} / {total}
      </div>

      <div style={{ marginTop: 8 }}>
        Accuracy: {percentage}%
      </div>

      {lastResult !== null && (
        <div
          style={{
            marginTop: 12,
            color: lastResult
              ? "#00cc66"
              : "#ff5555",
            fontWeight: "bold",
          }}
        >
          {lastResult
            ? "✅ Correct"
            : "❌ Wrong"}
        </div>
      )}
    </div>
  );
}

export default QuizScore;