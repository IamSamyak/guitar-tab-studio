import React from "react";
import { getNoteColor } from "../utils/noteColors";

const STRINGS = ["E", "A", "D", "G", "B", "E"];

export default function TabPreview({ notes, capo = 0 }) {
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

              // 🔥 Adjust fret based on capo
              const displayFret = note
                ? Math.max(note.fret - capo, 0)
                : null;

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