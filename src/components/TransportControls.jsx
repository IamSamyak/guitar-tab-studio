import React from "react";

function TransportControls({
  selectedNotes,
  playMode,
  setPlayMode,
  onPlaySelection,
  onPlayTab,
  onAddStep,
  onNewRow,
  isEditing,
}) {
  return (
    <div style={transport}>
      {/* ADD STEP */}
      <button style={btnPrimary} onClick={onAddStep}>
        {isEditing ? "✏️ Update Step" : "+ Add Step"}
      </button>

      {/* NEW ROW */}
      <button style={btnGhost} onClick={onNewRow}>
        ➕ New Row
      </button>

      {/* PLAY SELECTION */}
      <button
        style={btnPlay}
        onClick={onPlaySelection}
        disabled={selectedNotes.length === 0}
      >
        ▶ Selection
      </button>

      {/* PLAY FULL TAB */}
      <button style={btnPlayBig} onClick={onPlayTab}>
        🎼 Play Tab
      </button>

      {/* MODE TOGGLE */}
      <button
        style={btnGhost}
        onClick={() =>
          setPlayMode((p) => (p === "chord" ? "arpeggio" : "chord"))
        }
      >
        {playMode === "chord" ? "Chord" : "Arpeggio"}
      </button>
    </div>
  );
}

export default TransportControls;

/* styles */
const transport = {
  display: "flex",
  gap: 10,
  marginBottom: 16,
};

const btnPrimary = {
  background: "#0051d5",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

const btnPlay = {
  background: "#1db954",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

const btnPlayBig = {
  background: "#ff7a00",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  cursor: "pointer",
};

const btnGhost = {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
};