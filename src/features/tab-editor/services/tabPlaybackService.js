import * as Tone from "tone";

import {
  getSampler,
} from "../../../audio/engine/sampler";

import {
  noteToTone,
} from "../../../theory/notes/midiUtils";

/* =====================================
   PLAY SINGLE STEP
===================================== */

export async function playStep(
  notes,
  mode = "chord"
) {
  if (!notes?.length) return;

  const sampler =
    await getSampler();

  const toneNotes =
    notes.map((note) =>
      noteToTone(note.note)
    );

  /* =====================================
     CHORD MODE
  ===================================== */

  if (mode === "chord") {
    sampler.triggerAttackRelease(
      toneNotes,
      "1n"
    );

    return;
  }

  /* =====================================
     ARPEGGIO MODE
  ===================================== */

  toneNotes.forEach(
    (note, index) => {
      setTimeout(() => {
        sampler.triggerAttackRelease(
          note,
          "8n"
        );
      }, index * 160);
    }
  );
}

/* =====================================
   PLAY TAB
===================================== */

export async function playTab(
  tabRows,
  tempo = 90,
  mode = "chord"
) {
  if (!tabRows?.length) return;

  await Tone.start();

  const stepDuration =
    (60 / tempo) * 1000;

  let currentTime = 0;

  for (const row of tabRows) {
    for (const step of row.steps) {
      setTimeout(() => {
        playStep(step, mode);
      }, currentTime);

      currentTime +=
        stepDuration;
    }
  }
}