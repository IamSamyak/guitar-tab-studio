import { useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";

export default function usePitchDetection(active) {
  const [note, setNote] = useState(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    let rafId;

    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      source.connect(analyser);

      const detector = PitchDetector.forFloat32Array(analyser.fftSize);
      const input = new Float32Array(detector.inputLength);

      const updatePitch = () => {
        analyser.getFloatTimeDomainData(input);

        const [pitch, clarity] = detector.findPitch(
          input,
          audioContext.sampleRate
        );

        if (clarity > 0.92 && pitch > 60 && pitch < 1200) {
          const detected = freqToNote(pitch);
          setNote(detected);
        }

        rafId = requestAnimationFrame(updatePitch);
      };

      updatePitch();
    };

    init();

    return () => {
      cancelAnimationFrame(rafId);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [active]);

  return note;
}

function freqToNote(freq) {
  const A4 = 440;
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  const n = Math.round(12 * Math.log2(freq / A4)) + 69;
  return notes[n % 12];
}