import * as Tone from "tone";

import { getRandomRoot } from "../../shared/utils/randomNoteUtils";

import {
  getSampler,
  setGlobalVolume,
} from "../engine/sampler";

import { noteToTone } from "../../theory/notes/midiUtils";

/* =====================================
   VOLUME
===================================== */

let volumeValue = 8;

/* =====================================
   SET VOLUME
===================================== */

export function setIntervalVolume(
  value
) {
  volumeValue = value;

  // sync with global sampler volume
  setGlobalVolume(value);
}

/* =====================================
   GET VOLUME
===================================== */

export function getIntervalVolume() {
  return volumeValue;
}

/* =====================================
   PLAY INTERVAL
===================================== */

export async function playInterval(
  interval,
  mode = "ascending"
) {
  try {
    await Tone.start();

    const sampler =
      await getSampler();

    // safety sync
    setGlobalVolume(volumeValue);

    const { root, target } =
      getRandomRoot(
        interval.semitones
      );

    /* ================================
       HARMONIC
    ================================= */

    if (
      mode === "harmonic"
    ) {
      sampler.triggerAttackRelease(
        [
          noteToTone(root),
          noteToTone(target),
        ],
        "1n"
      );

      return;
    }

    /* ================================
       ASCENDING
    ================================= */

    if (
      mode === "ascending"
    ) {
      sampler.triggerAttackRelease(
        noteToTone(root),
        "1n"
      );

      setTimeout(() => {
        sampler.triggerAttackRelease(
          noteToTone(target),
          "1n"
        );
      }, 900);

      return;
    }

    /* ================================
       DESCENDING
    ================================= */

    if (
      mode ===
      "descending"
    ) {
      sampler.triggerAttackRelease(
        noteToTone(target),
        "1n"
      );

      setTimeout(() => {
        sampler.triggerAttackRelease(
          noteToTone(root),
          "1n"
        );
      }, 900);
    }
  } catch (err) {
    console.error(
      "❌ playInterval error",
      err
    );
  }
}