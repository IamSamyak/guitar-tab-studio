import React from "react";

export default function PracticeNavbar({ onExit, onExport }) {
  return (
    <div style={nav}>
      <div style={{ fontWeight: "bold", fontSize: 18 }}>
        🎸 Resonance Practice
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button style={btnGhost} onClick={onExport}>
          ⬇ Export
        </button>

        <button style={btnDanger} onClick={onExit}>
          ✖ Exit
        </button>
      </div>
    </div>
  );
}

const nav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 20px",
  background: "#121212",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const btnGhost = {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
};

const btnDanger = {
  background: "#e53935",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
};