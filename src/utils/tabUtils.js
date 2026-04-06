import { playNote, startAudio } from "../audio/sampler";

export const playSelectedNotes = async (selectedNotes, playMode) => {
  if (!selectedNotes.length) return;

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

export const playTab = async (tabRows, tempo, playMode) => {
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