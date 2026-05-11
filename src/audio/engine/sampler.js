import * as Tone from "tone";

let sampler = null;

let loadingPromise = null;

let volumeNode = null;

let currentVolume = 8;

export async function getSampler() {
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

          onerror: reject,
        }).connect(volumeNode);

        setGlobalVolume(
          currentVolume
        );
      } catch (err) {
        reject(err);
      }
    }
  );

  return loadingPromise;
}

export function setGlobalVolume(
  value
) {
  currentVolume = value;

  if (!volumeNode) return;

  const db = -30 + value * 3;

  volumeNode.volume.value = db;
}

export function getGlobalVolume() {
  return currentVolume;
}