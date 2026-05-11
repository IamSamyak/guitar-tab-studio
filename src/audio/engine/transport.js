import * as Tone from "tone";

export function stopTransport() {
  Tone.Transport.stop();

  Tone.Transport.cancel();
}

export function startTransport() {
  Tone.Transport.start();
}