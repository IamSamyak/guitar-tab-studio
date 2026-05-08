import React from "react";

function IntervalButtons({
  onAnswer,
  disabled,
  options = [], // 🔥 IMPORTANT: dynamic input
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(120px, 1fr))",
        gap: 12,
        width: "100%",
      }}
    >
      {options.map((interval) => (
        <button
          key={interval.id}
          disabled={disabled}
          onClick={() => onAnswer(interval.id)}
          style={{
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #3f3f46",
            cursor: disabled ? "not-allowed" : "pointer",
            background: disabled ? "#1f1f1f" : "#2d2d2d",
            color: "#fff",
            transition: "0.2s",
          }}
        >
          {interval.label ?? interval.name ?? interval.id}
        </button>
      ))}
    </div>
  );
}

export default IntervalButtons;