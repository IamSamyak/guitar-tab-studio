// Extract expected notes from step
export const getExpectedNotes = (step) => {
  return step.map((n) => n.note.replace(/[0-9]/g, ""));
};

// Compare detected vs expected
export const isCorrectNote = (detected, expectedNotes) => {
  if (!detected) return false;
  return expectedNotes.includes(detected);
};