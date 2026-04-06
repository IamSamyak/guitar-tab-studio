import { useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";

export default function usePitchDetection(active) {
  const [note, setNote] = useState(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) {
      cleanup();
      return;
    }

    let isMounted = true;

    const init = async () => {
      try {
        // 🎤 Request mic (this triggers permission popup)
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });

        if (!isMounted) return;

        streamRef.current = stream;

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
          } else {
            setNote(null);
          }

          rafRef.current = requestAnimationFrame(updatePitch);
        };

        updatePitch();
      } catch (err) {
        console.error("🎤 Mic error:", err);
      }
    };

    init();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [active]);

  /* =========================
     CLEANUP (VERY IMPORTANT)
  ========================= */
  const cleanup = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    analyserRef.current = null;
    setNote(null);
  };

  return note;
}

/* =========================
   Frequency → Note
========================= */
function freqToNote(freq) {
  const A4 = 440;
  const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const n = Math.round(12 * Math.log2(freq / A4)) + 69;
  return notes[n % 12];
}