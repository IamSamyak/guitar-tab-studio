import * as Tone from "tone";

let isStarted = false;

/* 🔓 Start Audio */
export const startAudio = async () => {
  if (!isStarted) {
    await Tone.start();
    console.log("🔊 Audio Started");
    isStarted = true;
  }
};

/* 🎸 REVERB */
const reverb = new Tone.Reverb({
  decay: 2,
  wet: 0.3,
}).toDestination();

/* 🎸 FULL RANGE SAMPLER */
const sampler = new Tone.Sampler({
  urls: {
    // 🔽 LOW OCTAVE (CRITICAL)
    E2: "E2.mp3",
    F2: "F2.mp3",
    "F#2": "Fs2.mp3",
    G2: "G2.mp3",
    "G#2": "Gs2.mp3",
    A2: "A2.mp3",
    "A#2": "As2.mp3",
    B2: "B2.mp3",

    C3: "C3.mp3",
    "C#3": "Cs3.mp3",
    D3: "D3.mp3",
    "D#3": "Ds3.mp3",
    E3: "E3.mp3",
    F3: "F3.mp3",
    "F#3": "Fs3.mp3",
    G3: "G3.mp3",
    "G#3": "Gs3.mp3",
    A3: "A3.mp3",
    "A#3": "As3.mp3",
    B3: "B3.mp3",

    C4: "C4.mp3",
    "C#4": "Cs4.mp3",
    D4: "D4.mp3",
    "D#4": "Ds4.mp3",
    E4: "E4.mp3",
    F4: "F4.mp3",
    "F#4": "Fs4.mp3",
    G4: "G4.mp3",
    "G#4": "Gs4.mp3",
    A4: "A4.mp3",
    "A#4": "As4.mp3",
    B4: "B4.mp3",

    // 🔼 HIGH NOTES (important for high frets)
    C5: "C5.mp3",
    "C#5": "Cs5.mp3",
    D5: "D5.mp3",
  },
  release: 1.2,
  baseUrl: process.env.PUBLIC_URL + "/samples/guitar-acoustic/",
  onload: () => {
    console.log("✅ ALL SAMPLES LOADED");
  },
}).connect(reverb);

/* 🎸 Play Note */
export const playNote = async (noteName) => {
  await startAudio();

  console.log("🎸 Playing:", noteName);

  sampler.triggerAttackRelease(noteName, "8n");
};