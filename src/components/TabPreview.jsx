import React from "react";
import { getNoteColor } from "../utils/noteColors";

const STRINGS = ["E", "A", "D", "G", "B", "E"];

// 🔥 Adjust this based on your PDF layout width
const MAX_STEPS_PER_LINE = 12;

export default function TabPreview({
  notes,
  capo = 0,
  onEditStep,
  onDeleteStep,
  editingStepIndex,
}) {
  const showWarning = notes.length >= MAX_STEPS_PER_LINE;

  return (
    <div
      style={{
        background: "#1f1f1f",
        padding: "16px",
        borderRadius: "12px",
        color: "#fff",
        overflowX: "auto",
        fontFamily: "monospace",
      }}
    >
      {/* Title + Capo Info */}
      <h3 style={{ marginBottom: 4 }}>
        Tab Preview {capo > 0 && `• Capo ${capo}`}
      </h3>

      {capo > 0 && (
        <div style={{ marginBottom: 10, fontSize: 12, color: "#aaa" }}>
          Frets are shown relative to capo
        </div>
      )}

      {/* ⚠️ Warning */}
      {showWarning && (
        <div
          style={{
            marginBottom: 12,
            padding: "10px 12px",
            borderRadius: 8,
            background: "#ff9800",
            color: "#000",
            fontWeight: "bold",
            fontSize: 13,
          }}
        >
          ⚠️ This tab is getting long for A4 PDF. Consider splitting into
          multiple rows for better formatting.
        </div>
      )}

      {/* Container */}
      <div style={{ minWidth: notes.length * 70 + 100 }}>
        {/* Header */}
        <div style={{ display: "flex", marginBottom: 6 }}>
          <div style={{ width: 50 }} />
          {notes.map((_, colIndex) => (
            <div
              key={colIndex}
              style={{
                width: 60,
                textAlign: "center",
                color: "#888",
              }}
            >
              |
            </div>
          ))}
        </div>

        {/* Strings */}
        {STRINGS.map((string, stringIndex) => (
          <div
            key={stringIndex}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              padding: "4px 0",
            }}
          >
            {/* String label */}
            <div
              style={{
                width: 50,
                fontWeight: "bold",
                color: "#aaa",
              }}
            >
              {string} |
            </div>

            {/* Notes columns */}
            {notes.map((column, colIndex) => {
              const note = column.find(
                (n) => n.stringIndex === stringIndex
              );

              const bgColor = note
                ? getNoteColor(note.note)
                : "transparent";

              // Adjust fret based on capo
              const displayFret = note
                ? Math.max(note.fret - capo, 0)
                : null;

              const isEditing = editingStepIndex === colIndex;

              return (
                <div
                  key={colIndex}
                  style={{
                    width: 60,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {/* Vertical separator */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "1px",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  />

                  {/* Edit/Delete Controls */}
                  {stringIndex === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: -10,
                        right: 2,
                        display: "flex",
                        gap: 4,
                      }}
                    >
                      <button
                        onClick={() => onEditStep(colIndex)}
                        style={{
                          fontSize: 10,
                          padding: "2px 4px",
                          borderRadius: 4,
                          border: "none",
                          cursor: "pointer",
                          background: isEditing ? "#1db954" : "#444",
                          color: "#fff",
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => onDeleteStep(colIndex)}
                        style={{
                          fontSize: 10,
                          padding: "2px 4px",
                          borderRadius: 4,
                          border: "none",
                          cursor: "pointer",
                          background: "#e53935",
                          color: "#fff",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Fret number */}
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 6px",
                      borderRadius: "6px",
                      background: bgColor,
                      color: note ? "#000" : "#777",
                      fontWeight: "bold",
                      minWidth: 20,
                      border: isEditing
                        ? "2px solid #1db954"
                        : "none",
                    }}
                  >
                    {note ? displayFret : "-"}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}