import { useState } from "react";

export default function useTabEditor() {
  const [capo, setCapo] =
    useState(0);

  const [
    capoLocked,
    setCapoLocked,
  ] = useState(false);

  const [tempo, setTempo] =
    useState(90);

  const [playMode, setPlayMode] =
    useState("chord");

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

  /* =========================
     STAMP
  ========================= */
  function addStep() {
    if (
      selectedNotes.length === 0
    )
      return;

    setTabRows((prev) => {
      const updated = [...prev];

      const row = {
        ...updated[currentRow],
      };

      if (
        editingStepIndex !== null
      ) {
        const steps = [...row.steps];

        steps[editingStepIndex] =
          selectedNotes;

        row.steps = steps;

        setEditingStepIndex(null);
      } else {
        row.steps = [
          ...row.steps,
          selectedNotes,
        ];
      }

      updated[currentRow] = row;

      return updated;
    });

    setSelectedNotes([]);
  }

  /* =========================
     NEW ROW
  ========================= */
  function addRow() {
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
      tabRows.length
    );

    setEditingStepIndex(null);

    setSelectedNotes([]);
  }

  return {
    capo,
    setCapo,

    capoLocked,
    setCapoLocked,

    tempo,
    setTempo,

    playMode,
    setPlayMode,

    selectedNotes,
    setSelectedNotes,

    tabRows,
    setTabRows,

    currentRow,
    setCurrentRow,

    editingStepIndex,
    setEditingStepIndex,

    addStep,
    addRow,
  };
}