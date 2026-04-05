/**
 * Single source of truth for note colors
 */

export const NOTE_COLORS = {
  C: "#ef4444",
  "C#": "#f87171",
  D: "#f97316",
  "D#": "#fb923c",
  E: "#eab308",
  F: "#22c55e",
  "F#": "#4ade80",
  G: "#3b82f6",
  "G#": "#60a5fa",
  A: "#a855f7",
  "A#": "#c084fc",
  B: "#ec4899",
};

/**
 * Returns the color associated with a musical note.
 * Works with:
 * - "C"
 * - "C#"
 * - "C3"
 * - "D#4"
 */
export const getNoteColor = (note) => {
  if (!note) return "#ffffff";

  // 🔥 remove octave numbers (C3 → C, D#4 → D#)
  const baseNote = note.replace(/[0-9]/g, "");

  return NOTE_COLORS[baseNote] || "#ffffff";
};