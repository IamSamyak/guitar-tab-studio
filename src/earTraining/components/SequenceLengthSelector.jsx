import React from "react";

function SequenceLengthSelector({
  value,
  onChange,
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        marginTop: 20,
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: 8,
          color: "#aaa",
          fontSize: 14,
        }}
      >
        Sequence Length
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(
            Number(e.target.value)
          )
        }
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          background: "#18181b",
          color: "#fff",
          border: "1px solid #3f3f46",
        }}
      >
        <option value={2}>
          2 Intervals
        </option>

        <option value={3}>
          3 Intervals
        </option>

        <option value={4}>
          4 Intervals
        </option>

        <option value={5}>
          5 Intervals
        </option>
      </select>
    </div>
  );
}

export default SequenceLengthSelector;