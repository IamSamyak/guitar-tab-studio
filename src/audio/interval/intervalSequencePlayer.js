import * as Tone from "tone";

import { startAudio } from "../engine/audioEngine";

import { getSampler } from "../engine/sampler";

import {
  stopTransport,
  startTransport,
} from "../engine/transport";

import { midiToNote } from "../utils/midi";

import { toToneNote } from "../utils/toneNote";

export async function playIntervalSequence(
  sequence,
  mode = "ascending"
) {
  await startAudio();

  const sampler =
    await getSampler();

  stopTransport();

  let currentMidi = 60;

  const events = [];

  events.push({
    time: 0,
    note:
      midiToNote(currentMidi),
  });

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
        mode ===
        "harmonic"
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

  events.forEach((event) => {
    Tone.Transport.schedule(
      (time) => {
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

  startTransport();
}