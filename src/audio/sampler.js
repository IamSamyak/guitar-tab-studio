import * as Tone from "tone";

/* 🎸 SAMPLER */
const sampler = new Tone.Sampler({
  urls: {
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
  },
  release: 1,
  baseUrl: "/samples/guitar-acoustic/",
}).toDestination();

/* 🔊 REVERB */
const reverb = new Tone.Reverb(1.8).toDestination();
sampler.connect(reverb);

/**
 * Ensure audio context is started
 */
export const startAudio = async () => {
  await Tone.start();
};

/**
 * Play a note
 */
export const playNote = async (noteName) => {
  await startAudio();
  sampler.triggerAttackRelease(noteName, "8n");
};