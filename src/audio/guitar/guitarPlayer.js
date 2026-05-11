import { startAudio } from "../engine/audioEngine";

import { getSampler } from "../engine/sampler";

import { toToneNote } from "../utils/toneNote";

export async function playGuitarNote(
  note
) {
  await startAudio();

  const sampler =
    await getSampler();

  sampler.triggerAttackRelease(
    toToneNote(note),
    "1n"
  );
}

export async function playChord(
  notes
) {
  await startAudio();

  const sampler =
    await getSampler();

  sampler.triggerAttackRelease(
    notes.map(toToneNote),
    "1n"
  );
}