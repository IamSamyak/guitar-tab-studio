import React, { useState, useRef, useEffect } from "react";
import Fretboard from "./components/Fretboard";
import TabPreview from "./components/TabPreview";
import jsPDF from "jspdf";
import { playNote, startAudio } from "./audio/sampler";

function App() {
  const [capo, setCapo] = useState(0);
  const [capoLocked, setCapoLocked] = useState(false);

  const [tempo, setTempo] = useState(90);
  const [selectedNotes, setSelectedNotes] = useState([]);

  // Updated structure: { name, steps }
  const [tabRows, setTabRows] = useState([
    { name: "Section 1", steps: [] }
  ]);

  const [currentRow, setCurrentRow] = useState(0);
  const [editingStepIndex, setEditingStepIndex] = useState(null);
  const [playMode, setPlayMode] = useState("chord");

  const rowsContainerRef = useRef();
  const MAX_STEPS_PER_LINE = 12;

  const currentRowData = tabRows[currentRow]?.steps || [];

  // Auto-scroll
  useEffect(() => {
    if (rowsContainerRef.current) {
      rowsContainerRef.current.scrollTop =
        rowsContainerRef.current.scrollHeight;
    }
  }, [tabRows]);

  // Unlock audio
  useEffect(() => {
    const unlock = async () => {
      await startAudio();
      window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock);
    return () => window.removeEventListener("click", unlock);
  }, []);

  // Update row name
  const updateRowName = (rowIndex, name) => {
    setTabRows((prev) => {
      const updated = [...prev];
      updated[rowIndex].name = name;
      return updated;
    });
  };

  // Add / Edit Step
  const handleStamp = () => {
    if (selectedNotes.length === 0) return;

    setTabRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[currentRow] };

      if (editingStepIndex !== null) {
        const steps = [...row.steps];
        steps[editingStepIndex] = selectedNotes;
        row.steps = steps;
        setEditingStepIndex(null);
      } else {
        row.steps = [...row.steps, selectedNotes];
      }

      updated[currentRow] = row;
      return updated;
    });

    setSelectedNotes([]);
  };

  // Delete step
  const deleteStep = (stepIndex) => {
    setTabRows((prev) => {
      const updated = [...prev];
      const row = { ...updated[currentRow] };
      row.steps = row.steps.filter((_, i) => i !== stepIndex);
      updated[currentRow] = row;
      return updated;
    });

    setEditingStepIndex(null);
  };

  // Edit step
  const editStep = (stepIndex) => {
    const step = currentRowData[stepIndex];
    setSelectedNotes(step);
    setEditingStepIndex(stepIndex);
  };

  // New row
  const addNewRow = () => {
    setTabRows((prev) => [
      ...prev,
      { name: `Section ${prev.length + 1}`, steps: [] }
    ]);
    setCurrentRow((prev) => prev + 1);
    setEditingStepIndex(null);
  };

  // Play selected notes
  const playSelectedNotes = async () => {
    if (selectedNotes.length === 0) return;

    await startAudio();

    const sorted = [...selectedNotes].sort(
      (a, b) => a.stringIndex - b.stringIndex
    );

    if (playMode === "chord") {
      sorted.forEach((n) => playNote(n.note));
    } else {
      for (let n of sorted) {
        await playNote(n.note);
        await new Promise((res) => setTimeout(res, 120));
      }
    }
  };

  // Play full tab
  const playTab = async () => {
    if (tabRows.length === 0) return;

    await startAudio();
    const beat = 60000 / tempo;

    for (let row of tabRows) {
      for (let step of row.steps) {
        const sorted = [...step].sort(
          (a, b) => a.stringIndex - b.stringIndex
        );

        if (playMode === "chord") {
          sorted.forEach((n) => playNote(n.note));
        } else {
          for (let n of sorted) {
            await playNote(n.note);
            await new Promise((res) => setTimeout(res, 80));
          }
        }

        await new Promise((res) => setTimeout(res, beat));
      }
    }
  };

  // Save work
  const saveWork = () => {
    const fileName = prompt("Enter file name:", "guitar-tab-work");
    if (!fileName) return;

    const data = {
      capo,
      tempo,
      playMode,
      tabRows,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${fileName}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // Import work
  const importWork = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (data.tabRows) setTabRows(data.tabRows);
        if (data.capo !== undefined) setCapo(data.capo);
        if (data.tempo !== undefined) setTempo(data.tempo);
        if (data.playMode) setPlayMode(data.playMode);

        setCurrentRow(0);
        setEditingStepIndex(null);
        setSelectedNotes([]);
      } catch (err) {
        alert("Invalid file format");
      }
    };

    reader.readAsText(file);
  };

  // Export PDF
  const exportPDF = async () => {
    if (tabRows.length === 0) return;

    const fileName = prompt("Enter PDF file name:", "guitar-tab");
    if (!fileName) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const margin = 40;
    let y = 60;

    pdf.setFont("Courier", "normal");
    pdf.setFontSize(12);

    pdf.text("Guitar Tab Sheet", margin, y);
    y += 20;

    if (capo > 0) {
      pdf.text(`Capo on fret ${capo}`, margin, y);
      y += 20;
    }

    const STRINGS = ["E", "A", "D", "G", "B", "E"];

    tabRows.forEach((row, rowIndex) => {
      const steps = row.steps;

      pdf.text(row.name || `Section ${rowIndex + 1}`, margin, y);
      y += 16;

      STRINGS.forEach((stringName, stringIndex) => {
        let line = `${stringName}|`;

        steps.forEach((step) => {
          const note = step.find(
            (n) => n.stringIndex === stringIndex
          );

          if (note) {
            const fret = Math.max(note.fret - capo, 0);
            const fretStr = fret.toString().padStart(2, "0");
            line += `${fretStr}---`;
          } else {
            line += `-----`;
          }
        });

        line += "|";
        pdf.text(line, margin, y);
        y += 16;
      });

      y += 24;
    });

    pdf.save(`${fileName}.pdf`);
  };

  const showWarning = currentRowData.length >= MAX_STEPS_PER_LINE;

  return (
    <div style={main}>
      {showWarning && (
        <div style={warningBanner}>
          ⚠️ This row is long. Consider clicking "New Row" for better A4 PDF layout.
        </div>
      )}

      {/* Toolbar */}
      <div style={toolbar}>
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

        <div style={controlGroup}>
          <span style={label}>Tempo</span>
          <input
            type="range"
            min={40}
            max={200}
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            style={{ width: 140 }}
          />
          <input
            type="number"
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            style={tempoInput}
          />
          <span style={{ opacity: 0.6 }}>BPM</span>
        </div>

        <button style={btnGhost} onClick={saveWork}>💾 Save</button>

        <label style={btnGhost}>
          📂 Import
          <input
            type="file"
            accept=".json"
            onChange={importWork}
            style={{ display: "none" }}
          />
        </label>

        <button style={btnGhost} onClick={exportPDF}>⬇ Export</button>
      </div>

      {/* Tab History */}
      <div ref={rowsContainerRef} style={{ ...card, maxHeight: 300, overflowY: "auto" }}>
        {tabRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              marginBottom: 20,
              border:
                rowIndex === currentRow
                  ? "1px solid #0051d5"
                  : "1px solid transparent",
              borderRadius: 8,
              padding: 8,
            }}
          >
            <input
              value={row.name}
              onChange={(e) => updateRowName(rowIndex, e.target.value)}
              placeholder="Enter section name"
              style={{
                padding: "4px 6px",
                borderRadius: 6,
                background: "#121212",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                marginBottom: 6,
                width: "60%",
              }}
            />

            <TabPreview
              notes={row.steps}
              capo={capo}
              onEditStep={editStep}
              onDeleteStep={deleteStep}
              editingStepIndex={editingStepIndex}
            />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={transport}>
        <button style={btnPrimary} onClick={handleStamp}>
          {editingStepIndex !== null ? "✏️ Update Step" : "+ Add Step"}
        </button>

        <button style={btnGhost} onClick={addNewRow}>
          ➕ New Row
        </button>

        <button
          style={btnPlay}
          onClick={playSelectedNotes}
          disabled={selectedNotes.length === 0}
        >
          ▶ Selection
        </button>

        <button style={btnPlayBig} onClick={playTab}>
          🎼 Play Tab
        </button>

        <button
          style={btnGhost}
          onClick={() =>
            setPlayMode((p) => (p === "chord" ? "arpeggio" : "chord"))
          }
        >
          {playMode === "chord" ? "Chord" : "Arpeggio"}
        </button>
      </div>

      {/* Fretboard */}
      <div style={card}>
        <Fretboard
          capo={capo}
          selectedNotes={selectedNotes}
          setSelectedNotes={setSelectedNotes}
        />
      </div>
    </div>
  );
}

/* Styles */

const main = {
  padding: 20,
  background: "#121212",
  minHeight: "100vh",
  color: "#fff",
  fontFamily: "sans-serif",
};

const warningBanner = {
  marginBottom: 12,
  padding: "10px 12px",
  borderRadius: 8,
  background: "#ff9800",
  color: "#000",
  fontWeight: "bold",
};

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

const label = {
  fontSize: 12,
  opacity: 0.6,
};

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

const transport = {
  display: "flex",
  gap: 10,
  marginBottom: 16,
};

const card = {
  marginBottom: 20,
  background: "#1e1e1e",
  padding: 16,
  borderRadius: 12,
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
  ...btnPrimary,
  background: "#1db954",
};

const btnPlayBig = {
  ...btnPrimary,
  background: "#ff7a00",
};

const btnGhost = {
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
};

export default App;
