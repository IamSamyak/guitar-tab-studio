import React, {
  useState,
  useRef,
} from "react";

import Fretboard from "./components/Fretboard";
import Toolbar from "./components/Toolbar";
import TransportControls from "./components/TransportControls";
import TabHistory from "./components/TabHistory";

import PracticeContainer from "./practice/PracticeContainer";

import IntervalPractice from "./earTraining/components/IntervalPractice";

import IntervalQuiz from "./earTraining/components/IntervalQuiz";

import SequenceIntervalQuiz from "./earTraining/components/SequenceIntervalQuiz";

import {
  playTab,
  playSelectedNotes,
} from "./utils/tabUtils";

import {
  saveWork,
  importWork,
} from "./utils/fileUtils";

import { exportPDF } from "./services/pdfService";

function App() {
  const [capo, setCapo] =
    useState(0);

  const [
    capoLocked,
    setCapoLocked,
  ] = useState(false);

  const [tempo, setTempo] =
    useState(90);

  const [
    selectedNotes,
    setSelectedNotes,
  ] = useState([]);

  const [tabRows, setTabRows] =
    useState([
      {
        name: "Section 1",
        steps: [],
      },
    ]);

  const [currentRow, setCurrentRow] =
    useState(0);

  const [
    editingStepIndex,
    setEditingStepIndex,
  ] = useState(null);

  const [playMode, setPlayMode] =
    useState("chord");

  /* ================================
     SCREEN STATE
  ================================= */
  const [screen, setScreen] =
    useState("home");

  const rowsContainerRef =
    useRef();

  /* ================================
     ADD / EDIT STEP
  ================================= */
  const handleStamp = () => {
    if (
      selectedNotes.length === 0
    )
      return;

    setTabRows((prev) => {
      const updated = [...prev];

      const row = {
        ...updated[currentRow],
      };

      /* EDIT EXISTING STEP */
      if (
        editingStepIndex !== null
      ) {
        const steps = [...row.steps];

        steps[editingStepIndex] =
          selectedNotes;

        row.steps = steps;

        setEditingStepIndex(null);
      }

      /* ADD NEW STEP */
      else {
        row.steps = [
          ...row.steps,
          selectedNotes,
        ];
      }

      updated[currentRow] = row;

      return updated;
    });

    setSelectedNotes([]);
  };

  /* ================================
     ADD NEW ROW
  ================================= */
  const addNewRow = () => {
    setTabRows((prev) => [
      ...prev,
      {
        name: `Section ${
          prev.length + 1
        }`,
        steps: [],
      },
    ]);

    setCurrentRow(
      (prev) => prev + 1
    );

    setEditingStepIndex(null);

    setSelectedNotes([]);
  };

  /* ================================
     PRACTICE MODE
  ================================= */
  if (screen === "practice") {
    return (
      <div
        style={{
          background: "#121212",
          minHeight: "100vh",
          padding: 20,
          color: "#fff",
        }}
      >
        <button
          onClick={() =>
            setScreen("home")
          }
          style={backButtonStyle}
        >
          ← Back
        </button>

        <PracticeContainer
          steps={
            tabRows[currentRow]
              ?.steps || []
          }
          onExit={() =>
            setScreen("home")
          }
          onExport={() =>
            exportPDF({
              capo,
              tabRows,
            })
          }
        />
      </div>
    );
  }

  /* ================================
     INTERVAL PRACTICE
  ================================= */
  if (
    screen ===
    "interval-practice"
  ) {
    return (
      <div
        style={{
          padding: 20,
          minHeight: "100vh",
          background: "#121212",
          color: "#fff",
        }}
      >
        <button
          onClick={() =>
            setScreen("home")
          }
          style={backButtonStyle}
        >
          ← Back
        </button>

        <IntervalPractice />
      </div>
    );
  }

  /* ================================
     BASIC INTERVAL QUIZ
  ================================= */
  if (
    screen === "interval-quiz"
  ) {
    return (
      <div
        style={{
          padding: 20,
          minHeight: "100vh",
          background: "#121212",
          color: "#fff",
        }}
      >
        <button
          onClick={() =>
            setScreen("home")
          }
          style={backButtonStyle}
        >
          ← Back
        </button>

        <IntervalQuiz />
      </div>
    );
  }

  /* ================================
     ADVANCED SEQUENCE QUIZ
  ================================= */
  if (
    screen ===
    "sequence-quiz"
  ) {
    return (
      <div
        style={{
          padding: 20,
          minHeight: "100vh",
          background: "#121212",
          color: "#fff",
        }}
      >
        <button
          onClick={() =>
            setScreen("home")
          }
          style={backButtonStyle}
        >
          ← Back
        </button>

        <SequenceIntervalQuiz />
      </div>
    );
  }

  /* ================================
     TAB EDITOR
  ================================= */
  if (screen === "editor") {
    return (
      <div
        style={{
          padding: 20,
          background: "#121212",
          minHeight: "100vh",
          color: "#fff",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 28,
            }}
          >
            🎸 Tab Editor
          </h1>

          <button
            onClick={() =>
              setScreen("home")
            }
            style={backButtonStyle}
          >
            ← Home
          </button>
        </div>

        {/* TOOLBAR */}
        <Toolbar
          capo={capo}
          setCapo={setCapo}
          capoLocked={
            capoLocked
          }
          setCapoLocked={
            setCapoLocked
          }
          tempo={tempo}
          setTempo={setTempo}
          onSave={() =>
            saveWork({
              capo,
              tempo,
              playMode,
              tabRows,
            })
          }
          onImport={(e) =>
            importWork(e, {
              setCapo,
              setTempo,
              setPlayMode,
              setTabRows,
            })
          }
          onExport={() =>
            exportPDF({
              capo,
              tabRows,
            })
          }
        />

        {/* TAB HISTORY */}
        <div
          style={{
            marginTop: 20,
          }}
        >
          <TabHistory
            tabRows={tabRows}
            setTabRows={
              setTabRows
            }
            currentRow={
              currentRow
            }
            setCurrentRow={
              setCurrentRow
            }
            capo={capo}
            editingStepIndex={
              editingStepIndex
            }
            setEditingStepIndex={
              setEditingStepIndex
            }
            setSelectedNotes={
              setSelectedNotes
            }
            rowsContainerRef={
              rowsContainerRef
            }
          />
        </div>

        {/* CONTROLS */}
        <div
          style={{
            marginTop: 20,
          }}
        >
          <TransportControls
            selectedNotes={
              selectedNotes
            }
            playMode={playMode}
            setPlayMode={
              setPlayMode
            }
            onPlaySelection={() =>
              playSelectedNotes(
                selectedNotes,
                playMode
              )
            }
            onPlayTab={() =>
              playTab(
                tabRows,
                tempo,
                playMode
              )
            }
            onAddStep={
              handleStamp
            }
            onNewRow={
              addNewRow
            }
            isEditing={
              editingStepIndex !==
              null
            }
          />
        </div>

        {/* FRETBOARD */}
        <div
          style={{
            marginTop: 24,
            background: "#1b1b1b",
            padding: 20,
            borderRadius: 16,
            border:
              "1px solid #2f2f2f",
          }}
        >
          <Fretboard
            capo={capo}
            selectedNotes={
              selectedNotes
            }
            setSelectedNotes={
              setSelectedNotes
            }
          />
        </div>
      </div>
    );
  }

  /* ================================
     HOME SCREEN
  ================================= */
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom, #121212, #1b1b1b)",
        color: "#fff",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1000,
        }}
      >
        {/* TITLE */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 50,
          }}
        >
          <h1
            style={{
              fontSize: 48,
              marginBottom: 12,
            }}
          >
            🎸 Guitar Studio
          </h1>

          <p
            style={{
              color: "#999",
              fontSize: 18,
            }}
          >
            Practice • Ear
            Training • Tab
            Creation
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          <FeatureCard
            title="Tab Editor"
            icon="🎼"
            description="Create, edit and play guitar tabs."
            color="#ff7a00"
            onClick={() =>
              setScreen(
                "editor"
              )
            }
          />

          <FeatureCard
            title="Practice Mode"
            icon="🎯"
            description="Practice your saved tabs interactively."
            color="#0066ff"
            onClick={() =>
              setScreen(
                "practice"
              )
            }
          />

          <FeatureCard
            title="Interval Practice"
            icon="🎧"
            description="Train your ears with interval playback."
            color="#8b5cf6"
            onClick={() =>
              setScreen(
                "interval-practice"
              )
            }
          />

          <FeatureCard
            title="Interval Quiz"
            icon="🧠"
            description="Basic single interval recognition."
            color="#00aa55"
            onClick={() =>
              setScreen(
                "interval-quiz"
              )
            }
          />

          <FeatureCard
            title="Sequence Quiz"
            icon="🔥"
            description="Advanced interval sequence recognition."
            color="#ff0055"
            onClick={() =>
              setScreen(
                "sequence-quiz"
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ==================================
   FEATURE CARD
================================== */
function FeatureCard({
  title,
  icon,
  description,
  color,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#1d1d1d",
        border:
          "1px solid #2f2f2f",
        borderRadius: 20,
        padding: 28,
        cursor: "pointer",
        transition:
          "0.2s ease",
        boxShadow:
          "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          fontSize: 42,
          marginBottom: 16,
        }}
      >
        {icon}
      </div>

      <h2
        style={{
          margin: 0,
          marginBottom: 10,
          color,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#aaa",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}

/* ==================================
   SHARED BUTTON STYLE
================================== */
const backButtonStyle = {
  background: "#2a2a2a",
  color: "#fff",
  border: "1px solid #444",
  padding: "10px 16px",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: 14,
};

export default App;