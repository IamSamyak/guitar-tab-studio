import * as Tone from "tone";

let started = false;

export async function startAudio() {
  if (started) return;

  await Tone.start();

  started = true;

  console.log(
    "🔊 Audio unlocked"
  );
}