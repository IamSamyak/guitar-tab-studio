// src/audio/interval/intervalPlayer.js

import * as Tone from "tone";
import {
  getSampler,
  setGlobalVolume,
} from "../engine/sampler";
import { noteToTone } from "../../theory/notes/midiUtils";
import { getRandomRoot } from "../../shared/utils/randomNoteUtils";

/* =====================================
   VOLUME
===================================== */

let volumeValue = 8;

export function setIntervalVolume(value) {
  volumeValue = value;
  setGlobalVolume(value);
}

export function getIntervalVolume() {
  return volumeValue;
}

/* =====================================
   HELPERS
===================================== */

function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

/* =====================================
   PRELOAD — call from setup screen
   getSampler() caches the promise so
   calling it early just warms it up.
===================================== */

export async function preloadSampler() {
  try {
    await getSampler();
    return true;
  } catch {
    return false;
  }
}

/* =====================================
   PLAY INTERVAL

   fixedNotes format:
   {
     root: "C3",
     target: "E3"
   }

   Behavior:
   - If fixedNotes is provided, use them.
   - Otherwise generate a new random root.
   - Returns the actual notes used so callers
     can display them if needed.
===================================== */

export async function playInterval(
  interval,
  mode = "ascending",
  fixedNotes = null
) {
  try {
    if (!interval) return null;

    // Unlock audio context (required by browsers)
    if (Tone.context.state !== "running") {
      await Tone.start();
    }

    // Wait until sampler is fully loaded
    const sampler = await getSampler();

    // Sync global volume
    setGlobalVolume(volumeValue);

    // Stop any currently playing notes
    sampler.releaseAll();

    // Use supplied notes or generate random notes
    const notes =
      fixedNotes ||
      getRandomRoot(interval.semitones);

    const { root, target } = notes;

    // Convert note names into Tone.js note format
    const rootNote = noteToTone(root);
    const targetNote = noteToTone(target);

    /* =====================================
       CONSOLE LOG
    ===================================== */

    const displayPattern =
      mode === "descending"
        ? `${target} → ${root}`
        : mode === "harmonic"
        ? `${root} + ${target}`
        : `${root} → ${target}`;

    console.log(
      `[Interval Player] ${interval.label} (${interval.short}) | Mode: ${mode} | Notes: ${displayPattern}`
    );

    /* ================================
       HARMONIC
    ================================= */

    if (mode === "harmonic") {
      sampler.triggerAttackRelease(
        [rootNote, targetNote],
        "1n"
      );

      return notes;
    }

    /* ================================
       ASCENDING
    ================================= */

    if (mode === "ascending") {
      sampler.triggerAttackRelease(
        rootNote,
        "1n"
      );

      await sleep(900);

      sampler.triggerAttackRelease(
        targetNote,
        "1n"
      );

      return notes;
    }

    /* ================================
       DESCENDING
    ================================= */

    if (mode === "descending") {
      sampler.triggerAttackRelease(
        targetNote,
        "1n"
      );

      await sleep(900);

      sampler.triggerAttackRelease(
        rootNote,
        "1n"
      );

      return notes;
    }

    /* ================================
       FALLBACK (Ascending)
    ================================= */

    sampler.triggerAttackRelease(
      rootNote,
      "1n"
    );

    await sleep(900);

    sampler.triggerAttackRelease(
      targetNote,
      "1n"
    );

    return notes;
  } catch (err) {
    console.error(
      "❌ playInterval error",
      err
    );
    throw err;
  }
}