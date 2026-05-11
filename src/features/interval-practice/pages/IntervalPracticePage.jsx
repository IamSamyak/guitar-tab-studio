import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import * as Tone from "tone";

import { INTERVALS } from "../../../theory/intervals/intervalData";
import IntervalControls from "../components/IntervalControls";

const ALL_NOTES = [
  "C3",
  "C#3",
  "D3",
  "D#3",
  "E3",
  "F3",
  "F#3",
  "G3",
  "G#3",
  "A3",
  "A#3",
  "B3",
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
];

function getRandomRootNote(semitones) {
  const maxIndex = ALL_NOTES.length - 1 - semitones;
  const rootIndex = Math.floor(Math.random() * (maxIndex + 1));
  return ALL_NOTES[rootIndex];
}

function getNoteByOffset(rootNote, semitones) {
  const rootIndex = ALL_NOTES.indexOf(rootNote);
  return ALL_NOTES[rootIndex + semitones];
}

export default function IntervalPracticePage() {
  const [selectedInterval, setSelectedInterval] = useState(INTERVALS[0]);

  const [mode, setMode] = useState("ascending");

  const [speed, setSpeed] = useState(2000);

  const [volume, setVolume] = useState(0);

  const [running, setRunning] = useState(false);

  const [sessionDuration, setSessionDuration] = useState(300);

  const [timeRemaining, setTimeRemaining] =
    useState(sessionDuration);

  const [currentNotes, setCurrentNotes] =
    useState(null);

  const synthRef = useRef(null);

  const intervalRef = useRef(null);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) {
      setTimeRemaining(sessionDuration);
    }
  }, [sessionDuration, running]);

  useEffect(() => {
    synthRef.current = new Tone.PolySynth(
      Tone.Synth,
      {
        oscillator: {
          type: "triangle",
        },

        envelope: {
          attack: 0.02,
          decay: 0.3,
          sustain: 0.4,
          release: 1.2,
        },
      }
    ).toDestination();

    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.volume.value = volume;
    }
  }, [volume]);

  const playInterval = useCallback(async () => {
    await Tone.start();

    const { semitones } = selectedInterval;

    const root = getRandomRootNote(semitones);

    const top = getNoteByOffset(
      root,
      semitones
    );

    setCurrentNotes({ root, top });

    const now = Tone.now();

    const synth = synthRef.current;

    if (mode === "ascending") {
      synth.triggerAttackRelease(
        root,
        "2n",
        now
      );

      synth.triggerAttackRelease(
        top,
        "2n",
        now + 0.6
      );
    } else if (mode === "descending") {
      synth.triggerAttackRelease(
        top,
        "2n",
        now
      );

      synth.triggerAttackRelease(
        root,
        "2n",
        now + 0.6
      );
    } else {
      synth.triggerAttackRelease(
        [root, top],
        "2n",
        now
      );
    }
  }, [selectedInterval, mode]);

  useEffect(() => {
    if (running) {
      playInterval();

      intervalRef.current = setInterval(
        playInterval,
        speed
      );

      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setRunning(false);

            return sessionDuration;
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);

      clearInterval(timerRef.current);

      setCurrentNotes(null);

      setTimeRemaining(sessionDuration);
    }

    return () => {
      clearInterval(intervalRef.current);

      clearInterval(timerRef.current);
    };
  }, [
    running,
    speed,
    playInterval,
    sessionDuration,
  ]);

  const handleToggleRunning = () => {
    setRunning((prev) => !prev);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const s = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${m}:${s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, #05070d 0%, #02040a 45%, #010205 75%, #000000 100%)",
      }}
    >
      {/* BACKGROUND BLOBS */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{
            x: [0, 80, -60, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "45rem",
            height: "45rem",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.03) 35%, transparent 72%)",
            filter: "blur(90px)",
          }}
        />

        <motion.div
          animate={{
            x: [0, -100, 70, 0],
            y: [0, 60, -30, 0],
            scale: [1, 0.92, 1.08, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "20%",
            right: "-15%",
            width: "50rem",
            height: "50rem",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0.025) 40%, transparent 72%)",
            filter: "blur(110px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.72))",
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 w-full px-4 py-8 lg:px-10 xl:px-16">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-12"
        >
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-white/55">
            Ear Training
          </span>

          <h1 className="mt-5 text-[clamp(2.8rem,8vw,6rem)] font-black leading-[0.9] tracking-[-0.05em] text-white">
            Interval
            <br />
            Practice
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/45 lg:text-base">
            Build interval recognition with
            focused listening sessions designed
            for guitar players and musicians.
          </p>
        </motion.div>

        {/* LAYOUT */}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_420px]">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* DISPLAY */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-white/[0.025] p-8 backdrop-blur-xl lg:min-h-[560px] lg:p-12">
              {running && currentNotes ? (
                <div className="flex h-full flex-col justify-center">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/35">
                    Now Playing
                  </p>

                  <h2 className="mt-5 text-7xl font-black tracking-[-0.05em] text-white lg:text-8xl">
                    {selectedInterval.short}
                  </h2>

                  <p className="mt-3 text-xl text-white/65 lg:text-2xl">
                    {selectedInterval.label}
                  </p>

                  <div className="mt-10 border-t border-white/5 pt-6">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/30">
                      Current Notes
                    </p>

                    <p className="mt-3 font-mono text-lg text-white/55">
                      {mode === "descending"
                        ? `${currentNotes.top} → ${currentNotes.root}`
                        : mode ===
                          "harmonic"
                        ? `${currentNotes.root} + ${currentNotes.top}`
                        : `${currentNotes.root} → ${currentNotes.top}`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex h-[320px] items-center justify-center lg:h-full">
                  <div className="text-center">
                    <p className="text-lg text-white/45">
                      Press Start to begin
                    </p>

                    <p className="mt-2 text-sm text-white/25">
                      Focused interval training
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* TIMER */}
            {running && (
              <div className="rounded-[1.75rem] border border-white/[0.06] bg-white/[0.025] p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/35">
                    Session Remaining
                  </span>

                  <span className="font-mono text-2xl font-semibold text-white">
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-white/80 transition-all duration-1000"
                    style={{
                      width: `${
                        (timeRemaining /
                          sessionDuration) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* RIGHT */}
          <IntervalControls
            selectedInterval={
              selectedInterval
            }
            setSelectedInterval={
              setSelectedInterval
            }
            mode={mode}
            setMode={setMode}
            speed={speed}
            setSpeed={setSpeed}
            running={running}
            setRunning={
              handleToggleRunning
            }
            volume={volume}
            setVolume={setVolume}
            sessionDuration={
              sessionDuration
            }
            setSessionDuration={
              setSessionDuration
            }
          />
        </div>
      </div>
    </motion.div>
  );
}