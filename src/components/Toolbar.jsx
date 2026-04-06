import React from "react";

function Toolbar({
  capo,
  setCapo,
  capoLocked,
  setCapoLocked,
  tempo,
  setTempo,
  onSave,
  onImport,
  onExport,
}) {
  return (
    <div style={toolbar}>
      {/* Capo */}
      <div style={controlGroup}>
        <span style={label}>Capo</span>
        <select
          value={capo}
          disabled={capoLocked}
          onChange={(e) => setCapo(Number(e.target.value))}
          style={selectStyle}
        >
          {Array.from({ length: 13 }).map((_, i) => (
            <option key={i}>{i}</option>
          ))}
        </select>

        <button onClick={() => setCapoLocked((p) => !p)} style={btnGhost}>
          {capoLocked ? "🔓" : "🔒"}
        </button>
      </div>

      {/* Tempo */}
      <div style={controlGroup}>
        <span style={label}>Tempo</span>

        <input
          type="range"
          min={40}
          max={200}
          value={tempo}
          onChange={(e) => setTempo(Number(e.target.value))}
        />

        <input
          type="number"
          value={tempo}
          onChange={(e) => setTempo(Number(e.target.value))}
          style={tempoInput}
        />

        <span style={{ opacity: 0.6 }}>BPM</span>
      </div>

      {/* Actions */}
      <button style={btnGhost} onClick={onSave}>💾 Save</button>

      <label style={btnGhost}>
        📂 Import
        <input
          type="file"
          accept=".json"
          onChange={onImport}
          style={{ display: "none" }}
        />
      </label>

      <button style={btnGhost} onClick={onExport}>⬇ Export</button>
    </div>
  );
}

export default Toolbar;

/* styles */
const toolbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
  background: "#1e1e1e",
  padding: "12px 16px",
  borderRadius: 12,
};

const controlGroup = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const label = { fontSize: 12, opacity: 0.6 };

const selectStyle = {
  padding: "4px 6px",
  borderRadius: 6,
  background: "#121212",
  color: "#fff",
};

const tempoInput = {
  width: 60,
  padding: 4,
  borderRadius: 6,
  background: "#121212",
  color: "#fff",
};

const btnGhost = {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
};