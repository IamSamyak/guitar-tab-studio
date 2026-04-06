import React, { useEffect } from "react";
import TabPreview from "./TabPreview";
import SectionEditor from "./SectionEditor";

function TabHistory({
  tabRows,
  setTabRows,
  currentRow,
  setCurrentRow,
  capo,
  editingStepIndex,
  setEditingStepIndex,
  setSelectedNotes,
  rowsContainerRef,
}) {
  // Auto scroll
  useEffect(() => {
    if (rowsContainerRef.current) {
      rowsContainerRef.current.scrollTop =
        rowsContainerRef.current.scrollHeight;
    }
  }, [tabRows, rowsContainerRef]);

  const updateRowName = (index, name) => {
    setTabRows((prev) => {
      const updated = [...prev];
      updated[index].name = name;
      return updated;
    });
  };

  const deleteStep = (rowIndex, stepIndex) => {
    setTabRows((prev) => {
      const updated = [...prev];
      updated[rowIndex].steps = updated[rowIndex].steps.filter(
        (_, i) => i !== stepIndex
      );
      return updated;
    });
    setEditingStepIndex(null);
  };

  const editStep = (rowIndex, stepIndex) => {
    setCurrentRow(rowIndex);
    setSelectedNotes(tabRows[rowIndex].steps[stepIndex]);
    setEditingStepIndex(stepIndex);
  };

  return (
    <div
      ref={rowsContainerRef}
      style={{ ...card, maxHeight: 300, overflowY: "auto" }}
    >
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
          <SectionEditor
            name={row.name}
            onChange={(val) => updateRowName(rowIndex, val)}
          />

          <TabPreview
            notes={row.steps}
            capo={capo}
            onEditStep={(i) => editStep(rowIndex, i)}
            onDeleteStep={(i) => deleteStep(rowIndex, i)}
            editingStepIndex={editingStepIndex}
          />
        </div>
      ))}
    </div>
  );
}

export default TabHistory;

/* styles */
const card = {
  marginBottom: 20,
  background: "#1e1e1e",
  padding: 16,
  borderRadius: 12,
};