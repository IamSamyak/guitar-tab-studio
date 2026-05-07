import React from "react";

import { INTERVALS } from "../data/intervalData";

function IntervalButtons({
  onAnswer,
  disabled,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(120px, 1fr))",
        gap: 12,
      }}
    >
      {INTERVALS.map((interval) => (
        <button
          key={interval.id}
          disabled={disabled}
          onClick={() =>
            onAnswer(interval.id)
          }
          style={{
            padding: "12px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#2d2d2d",
            color: "#fff",
          }}
        >
          {interval.label}
        </button>
      ))}
    </div>
  );
}

export default IntervalButtons;