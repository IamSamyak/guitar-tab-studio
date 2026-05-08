import React from "react";

function SequenceOptions({
  options,
  onAnswer,
}) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 500,
        display: "grid",
        gap: 12,
        marginTop: 20,
      }}
    >
      {options.map(
        (sequence, index) => (
          <button
            key={index}
            onClick={() =>
              onAnswer(sequence)
            }
            style={{
              background: "#27272a",
              color: "#fff",
              border:
                "1px solid #3f3f46",
              borderRadius: 10,
              padding: 16,
              textAlign: "left",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            <strong>
              {String.fromCharCode(
                65 + index
              )}
              )
            </strong>{" "}
            {sequence
              .map(
                (interval) =>
                  interval.label
              )
              .join(" → ")}
          </button>
        )
      )}
    </div>
  );
}

export default SequenceOptions;