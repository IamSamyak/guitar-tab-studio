import * as Tone from "tone";

import { getRandomRoot } from "../utils/randomNoteUtils";

/* =====================================
   GLOBALS
===================================== */
let sampler = null;

let loadingPromise = null;

let volumeNode = null;

let currentVolume = 8;

/* =====================================
   As3 -> A#3
===================================== */
function toToneNote(note) {
  return note.replace("s", "#");
}

/* =====================================
   INIT SAMPLER
===================================== */
export async function initSampler() {
  if (sampler) {
    return sampler;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise(
    (resolve, reject) => {
      try {
        volumeNode =
          new Tone.Volume(
            0
          ).toDestination();

        sampler = new Tone.Sampler({
          urls: {
            A2: "A2.ogg",
            "A#2": "As2.ogg",
            B2: "B2.ogg",

            C3: "C3.ogg",
            "C#3": "Cs3.ogg",
            D3: "D3.ogg",
            "D#3": "Ds3.ogg",
            E3: "E3.ogg",
            F3: "F3.ogg",
            "F#3": "Fs3.ogg",
            G3: "G3.ogg",
            "G#3": "Gs3.ogg",
            A3: "A3.ogg",
            "A#3": "As3.ogg",
            B3: "B3.ogg",

            C4: "C4.ogg",
            "C#4": "Cs4.ogg",
            D4: "D4.ogg",
            "D#4": "Ds4.ogg",
            E4: "E4.ogg",
            F4: "F4.ogg",
            "F#4": "Fs4.ogg",
            G4: "G4.ogg",
            "G#4": "Gs4.ogg",
            A4: "A4.ogg",
            "A#4": "As4.ogg",
            B4: "B4.ogg",

            C5: "C5.ogg",
            "C#5": "Cs5.ogg",
            D5: "D5.ogg",
          },

          release: 1,

          baseUrl:
            process.env.PUBLIC_URL +
            "/samples/guitar-acoustic/",

          onload: () => {
            console.log(
              "✅ Sampler loaded"
            );

            resolve(sampler);
          },

          onerror: (err) => {
            console.error(
              "❌ Sampler error",
              err
            );

            reject(err);
          },
        }).connect(volumeNode);

        setIntervalVolume(
          currentVolume
        );
      } catch (err) {
        reject(err);
      }
    }
  );

  return loadingPromise;
}

/* =====================================
   VOLUME CONTROL
===================================== */
export function setIntervalVolume(
  value
) {
  currentVolume = value;

  if (!volumeNode) return;

  // 0-10 -> db
  const db = -30 + value * 3;

  volumeNode.volume.value = db;
}

export function getIntervalVolume() {
  return currentVolume;
}

/* =====================================
   PLAY NOTE
===================================== */
async function playNote(note) {
  try {
    const s =
      await initSampler();

    const toneNote =
      toToneNote(note);

    console.log(
      "🎵 Playing:",
      toneNote
    );

    s.triggerAttackRelease(
      toneNote,
      "1n"
    );
  } catch (err) {
    console.error(
      "❌ playNote error",
      err
    );
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
    await Tone.start();

    await initSampler();

    const { root, target } =
      getRandomRoot(
        interval.semitones
      );

    console.log(
      "🎼 Interval:",
      root,
      target
    );

    if (!root || !target) {
      return;
    }

    // ASCENDING
    if (mode === "ascending") {
      await playNote(root);

      setTimeout(() => {
        playNote(target);
      }, 900);
    }

    // DESCENDING
    else if (
      mode === "descending"
    ) {
      await playNote(target);

      setTimeout(() => {
        playNote(root);
      }, 900);
    }

    // HARMONIC
    else if (mode === "harmonic") {
      const s =
        await initSampler();

      s.triggerAttackRelease(
        [
          toToneNote(root),
          toToneNote(target),
        ],
        "1n"
      );
    }
  } catch (err) {
    console.error(
      "❌ playInterval error",
      err
    );
  }
}