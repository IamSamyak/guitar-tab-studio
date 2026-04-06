import React, { useState, useRef } from "react";
import Fretboard from "./components/Fretboard";
import Toolbar from "./components/Toolbar";
import TransportControls from "./components/TransportControls";
import TabHistory from "./components/TabHistory";
import PracticeContainer from "./practice/PracticeContainer"; // ✅ NEW

import { playTab, playSelectedNotes } from "./utils/tabUtils";
import { saveWork, importWork } from "./utils/fileUtils";
import { exportPDF } from "./services/pdfService";

function App() {
  const [capo, setCapo] = useState(0);
  const [capoLocked, setCapoLocked] = useState(false);
  const [tempo, setTempo] = useState(90);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [tabRows, setTabRows] = useState([
    { name: "Section 1", steps: [] },
  ]);
  const [currentRow, setCurrentRow] = useState(0);
  const [editingStepIndex, setEditingStepIndex] = useState(null);
  const [playMode, setPlayMode] = useState("chord");

  /* 🎯 PRACTICE MODE TOGGLE ONLY */
  const [practiceMode, setPracticeMode] = useState(false);

  const rowsContainerRef = useRef();

  /* ===============================
     ➕ ADD / EDIT STEP
  =============================== */
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

  /* ===============================
     ➕ NEW ROW
  =============================== */
  const addNewRow = () => {
    setTabRows((prev) => [
      ...prev,
      { name: `Section ${prev.length + 1}`, steps: [] },
    ]);

    setCurrentRow((prev) => prev + 1);
    setEditingStepIndex(null);
    setSelectedNotes([]);
  };

  /* ===============================
     🎯 PRACTICE MODE UI
  =============================== */
  if (practiceMode) {
    return (
      <PracticeContainer
        steps={tabRows[currentRow]?.steps || []}
        onExit={() => setPracticeMode(false)}
        onExport={() => exportPDF({ capo, tabRows })}
      />
    );
  }

  /* ===============================
     🧩 EDITOR MODE UI
  =============================== */
  return (
    <div
      style={{
        padding: 20,
        background: "#121212",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      {/* 🔝 Toolbar */}
      <Toolbar
        capo={capo}
        setCapo={setCapo}
        capoLocked={capoLocked}
        setCapoLocked={setCapoLocked}
        tempo={tempo}
        setTempo={setTempo}
        onSave={() => saveWork({ capo, tempo, playMode, tabRows })}
        onImport={(e) =>
          importWork(e, { setCapo, setTempo, setPlayMode, setTabRows })
        }
        onExport={() => exportPDF({ capo, tabRows })}
      />

      {/* 🎯 ENTER PRACTICE BUTTON */}
      <div style={{ marginBottom: 12 }}>
        <button
          onClick={() => setPracticeMode(true)}
          style={{
            background: "#ff7a00",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          🎯 Start Practice
        </button>
      </div>

      {/* 📜 Tab History */}
      <TabHistory
        tabRows={tabRows}
        setTabRows={setTabRows}
        currentRow={currentRow}
        setCurrentRow={setCurrentRow}
        capo={capo}
        editingStepIndex={editingStepIndex}
        setEditingStepIndex={setEditingStepIndex}
        setSelectedNotes={setSelectedNotes}
        rowsContainerRef={rowsContainerRef}
      />

      {/* 🎛 Controls */}
      <TransportControls
        selectedNotes={selectedNotes}
        playMode={playMode}
        setPlayMode={setPlayMode}
        onPlaySelection={() =>
          playSelectedNotes(selectedNotes, playMode)
        }
        onPlayTab={() =>
          playTab(tabRows, tempo, playMode)
        }
        onAddStep={handleStamp}
        onNewRow={addNewRow}
        isEditing={editingStepIndex !== null}
      />

      {/* 🎸 Fretboard */}
      <Fretboard
        capo={capo}
        selectedNotes={selectedNotes}
        setSelectedNotes={setSelectedNotes}
      />
    </div>
  );
}

export default App;