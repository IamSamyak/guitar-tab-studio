import React, { useState, useRef, useEffect } from "react";
import Fretboard from "./components/Fretboard";
import Toolbar from "./components/Toolbar";
import TransportControls from "./components/TransportControls";
import TabHistory from "./components/TabHistory";
import PracticePanel from "./components/PracticePanel";

import { playTab, playSelectedNotes } from "./utils/tabUtils";
import { saveWork, importWork } from "./utils/fileUtils";
import { exportPDF } from "./services/pdfService";

import usePitchDetection from "./hooks/usePitchDetection";
import { getExpectedNotes, isCorrectNote } from "./utils/practiceUtils";

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

  /* 🎯 PRACTICE STATE */
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const rowsContainerRef = useRef();

  /* 🎤 DETECTED NOTE */
  const detectedNote = usePitchDetection(practiceMode);

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
    setCurrentStepIndex(0);
  };

  /* ===============================
     🎯 PRACTICE LOGIC
  =============================== */
  useEffect(() => {
    if (!practiceMode) return;

    const currentStep = tabRows[currentRow]?.steps[currentStepIndex];
    if (!currentStep) return;

    const expected = getExpectedNotes(currentStep);

    if (isCorrectNote(detectedNote, expected)) {
      setFeedback("correct");

      setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 300);
    } else if (detectedNote) {
      setFeedback("wrong");
    }
  }, [detectedNote, practiceMode, currentStepIndex, currentRow, tabRows]);

  /* Reset when practice toggles */
  useEffect(() => {
    if (!practiceMode) {
      setCurrentStepIndex(0);
      setFeedback(null);
    }
  }, [practiceMode]);

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

      {/* 🎯 Practice Panel */}
      <PracticePanel
        practiceMode={practiceMode}
        setPracticeMode={setPracticeMode}
        detectedNote={detectedNote}
        expectedNotes={
          tabRows[currentRow]?.steps[currentStepIndex]
            ? getExpectedNotes(
                tabRows[currentRow].steps[currentStepIndex]
              )
            : []
        }
        feedback={feedback}
        currentStepIndex={currentStepIndex}
      />

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