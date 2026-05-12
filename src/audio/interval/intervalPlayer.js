// src/audio/interval/intervalPlayer.js

import * as Tone from "tone";
import { getSampler, setGlobalVolume } from "../engine/sampler";
import { noteToTone } from "../../theory/notes/midiUtils";

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

function midiToNote(midi) {
  return Tone.Frequency(midi, "midi").toNote();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStableRoot(interval) {
  const MIN_MIDI = 48;
  const MAX_MIDI = 71;
  const maxRoot = MAX_MIDI - interval.semitones;
  const availableRange = Math.max(1, maxRoot - MIN_MIDI + 1);

  const id = String(interval.id ?? "");
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) % 100000;
  }

  const rootMidi = MIN_MIDI + (hash % availableRange);
  const targetMidi = rootMidi + interval.semitones;

  return {
    root: midiToNote(rootMidi),
    target: midiToNote(targetMidi),
  };
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
===================================== */

export async function playInterval(
  interval,
  mode = "ascending"
) {
  try {
    if (!interval) return;

    // Unlock audio context (required by browsers)
    if (Tone.context.state !== "running") {
      await Tone.start();
    }

    // getSampler() resolves only after onload fires —
    // this is the fix for the "buffer not loaded" error
    const sampler = await getSampler();

    // Sync volume
    setGlobalVolume(volumeValue);

    // Stop any currently playing notes
    sampler.releaseAll();

    const { root, target } = getStableRoot(interval);
    const rootNote = noteToTone(root);
    const targetNote = noteToTone(target);

    /* ================================
       HARMONIC
    ================================= */

    if (mode === "harmonic") {
      sampler.triggerAttackRelease([rootNote, targetNote], "1n");
      return;
    }

    /* ================================
       ASCENDING
    ================================= */

    if (mode === "ascending") {
      sampler.triggerAttackRelease(rootNote, "1n");
      await sleep(900);
      sampler.triggerAttackRelease(targetNote, "1n");
      return;
    }

    /* ================================
       DESCENDING
    ================================= */

    if (mode === "descending") {
      sampler.triggerAttackRelease(targetNote, "1n");
      await sleep(900);
      sampler.triggerAttackRelease(rootNote, "1n");
      return;
    }

    // Fallback
    sampler.triggerAttackRelease(rootNote, "1n");
    await sleep(900);
    sampler.triggerAttackRelease(targetNote, "1n");

  } catch (err) {
    console.error("❌ playInterval error", err);
    throw err;
  }
}