import * as Tone from "tone";

import {
  initSampler,
} from "../services/intervalPlayer";

/* =====================================
   NOTE MAP
===================================== */
const NOTES = [
  "C",
  "Cs",
  "D",
  "Ds",
  "E",
  "F",
  "Fs",
  "G",
  "Gs",
  "A",
  "As",
  "B",
];

/* =====================================
   MIDI -> NOTE
===================================== */
function midiToNote(midi) {
  const octave =
    Math.floor(midi / 12) - 1;

  const note =
    NOTES[midi % 12];

  return `${note}${octave}`;
}

/* =====================================
   CONVERT
   As3 -> A#3
===================================== */
function toToneNote(note) {
  return note.replace("s", "#");
}

/* =====================================
   PLAY SINGLE NOTE
===================================== */
async function playNote(note) {
  const sampler =
    await initSampler();

  sampler.triggerAttackRelease(
    toToneNote(note),
    "1n"
  );
}

/* =====================================
   STOP ALL
===================================== */
export function stopSequencePlayback() {
  Tone.Transport.stop();

  Tone.Transport.cancel();
}

/* =====================================
   PLAY INTERVAL SEQUENCE
===================================== */
export async function playIntervalSequence(
  sequence,
  mode = "ascending"
) {
  try {
    await Tone.start();

    const sampler =
      await initSampler();

    stopSequencePlayback();

    if (!sequence?.length) return;

    /* =================================
       START NOTE
    ================================= */
    let currentMidi = 60; // C4

    const events = [];

    /* =================================
       ROOT NOTE
    ================================= */
    events.push({
      time: 0,
      note:
        midiToNote(currentMidi),
    });

    /* =================================
       BUILD CHAIN
    ================================= */
    sequence.forEach(
      (interval, index) => {
        if (
          mode === "ascending"
        ) {
          currentMidi +=
            interval.semitones;
        }

        else if (
          mode ===
          "descending"
        ) {
          currentMidi -=
            interval.semitones;
        }

        else if (
          mode === "harmonic"
        ) {
          currentMidi +=
            interval.semitones;
        }

        events.push({
          time:
            (index + 1) * 0.9,
          note:
            midiToNote(currentMidi),
        });
      }
    );

    /* =================================
       PLAY EVENTS
    ================================= */
    events.forEach((event) => {
      Tone.Transport.schedule(
        async (time) => {
          if (
            mode ===
            "harmonic"
          ) {
            const previous =
              events.find(
                (e) =>
                  e.time ===
                  event.time - 0.9
              );

            if (previous) {
              sampler.triggerAttackRelease(
                [
                  toToneNote(
                    previous.note
                  ),
                  toToneNote(
                    event.note
                  ),
                ],
                "1n",
                time
              );

              return;
            }
          }

          sampler.triggerAttackRelease(
            toToneNote(
              event.note
            ),
            "1n",
            time
          );
        },
        event.time
      );
    });

    Tone.Transport.start();
  } catch (err) {
    console.error(
      "❌ playIntervalSequence error",
      err
    );
  }
}