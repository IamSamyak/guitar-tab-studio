// src/features/interval-practice/components/IntervalControls.jsx

import { INTERVALS } from "../../../theory/intervals/intervalData";

const SESSION_OPTIONS = [
  { label: "1m", value: 60 },
  { label: "3m", value: 180 },
  { label: "5m", value: 300 },
  { label: "10m", value: 600 },
  { label: "15m", value: 900 },
  { label: "20m", value: 1200 },
];

const MODES = [
  {
    id: "ascending",
    label: "Ascending",
    icon: "↗",
  },
  {
    id: "descending",
    label: "Descending",
    icon: "↘",
  },
  {
    id: "harmonic",
    label: "Harmonic",
    icon: "♫",
  },
];

const FALLBACK_INTERVAL = {
  id: "m2",
  short: "m2",
  label: "Minor 2nd",
  semitones: 1,
};

function SectionLabel({ children }) {
  return (
    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
      {children}
    </label>
  );
}

export default function IntervalControls({
  selectedInterval,
  setSelectedInterval,
  mode = "ascending",
  setMode,
  speed = 3000,
  setSpeed,
  running = false,
  setRunning,
  volume = 8,
  setVolume,
  sessionDuration = 300,
  setSessionDuration = () => {},
}) {
  // Ensure we always have a valid interval object
  const currentInterval =
    selectedInterval ||
    INTERVALS?.[0] ||
    FALLBACK_INTERVAL;

  return (
    <div
      className="
        relative overflow-hidden
        rounded-[2rem]
        border border-white/10
        bg-white/[0.04]
        p-4 sm:p-6
        backdrop-blur-2xl
        shadow-[0_20px_80px_rgba(0,0,0,0.45)]
      "
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_45%)]
        "
      />

      <div className="relative space-y-7">
        {/* INTERVAL */}
        <div>
          <SectionLabel>
            Interval
          </SectionLabel>

          <select
            value={
              currentInterval.id
            }
            onChange={(e) => {
              const found =
                INTERVALS.find(
                  (interval) =>
                    interval.id ===
                    e.target.value
                );

              if (found) {
                setSelectedInterval(
                  found
                );
              }
            }}
            className="
              w-full
              rounded-2xl
              border border-white/10
              bg-zinc-950/80
              px-4 py-4
              text-white
              outline-none
              transition
              focus:border-cyan-400/70
              focus:ring-2 focus:ring-cyan-400/20
            "
          >
            {INTERVALS.map(
              (interval) => (
                <option
                  key={interval.id}
                  value={
                    interval.id
                  }
                >
                  {interval.short} —{" "}
                  {
                    interval.label
                  }
                </option>
              )
            )}
          </select>
        </div>

        {/* PLAYBACK MODE */}
        <div>
          <SectionLabel>
            Playback Mode
          </SectionLabel>

          <div className="grid grid-cols-3 gap-2">
            {MODES.map(
              (
                currentMode
              ) => {
                const active =
                  mode ===
                  currentMode.id;

                return (
                  <button
                    key={
                      currentMode.id
                    }
                    type="button"
                    onClick={() =>
                      setMode(
                        currentMode.id
                      )
                    }
                    className={`
                      rounded-2xl
                      px-3 py-3
                      transition-all
                      ${
                        active
                          ? "bg-cyan-400 text-black shadow-lg shadow-cyan-500/20"
                          : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    <div className="text-lg">
                      {
                        currentMode.icon
                      }
                    </div>

                    <div className="mt-1 text-xs font-semibold">
                      {
                        currentMode.label
                      }
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* PRACTICE TIMER */}
        <div>
          <SectionLabel>
            Practice Duration
          </SectionLabel>

          <div className="grid grid-cols-3 gap-2">
            {SESSION_OPTIONS.map(
              (option) => {
                const active =
                  sessionDuration ===
                  option.value;

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      setSessionDuration(
                        option.value
                      )
                    }
                    className={`
                      rounded-xl
                      px-3 py-2.5
                      text-sm font-semibold
                      transition-all
                      ${
                        active
                          ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                          : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    {
                      option.label
                    }
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* PLAYBACK SPEED */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>
              Playback Speed
            </SectionLabel>

            <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-400">
              {(
                speed / 1000
              ).toFixed(1)}
              s
            </span>
          </div>

          <input
            type="range"
            min="1500"
            max="6000"
            step="250"
            value={speed}
            onChange={(e) =>
              setSpeed(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full cursor-pointer accent-cyan-400"
          />

          <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
            <span>Fast</span>
            <span>Slow</span>
          </div>
        </div>

        {/* VOLUME */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>
              Volume
            </SectionLabel>

            <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-400">
              {volume} dB
            </span>
          </div>

          <input
            type="range"
            min="-20"
            max="15"
            step="1"
            value={volume}
            onChange={(e) =>
              setVolume(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full cursor-pointer accent-emerald-400"
          />

          <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
            <span>Quiet</span>
            <span>Loud</span>
          </div>
        </div>

        {/* START / STOP BUTTON */}
        <button
          type="button"
          onClick={() =>
            setRunning(
              (prev) => !prev
            )
          }
          className={`
            min-h-[60px]
            w-full
            rounded-2xl
            px-6
            text-base font-bold
            text-white
            transition-all
            active:scale-[0.98]
            ${
              running
                ? "bg-gradient-to-r from-rose-500 to-red-500 hover:brightness-110 shadow-lg shadow-red-500/20"
                : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 shadow-lg shadow-emerald-500/20"
            }
          `}
        >
          {running
            ? "■ Stop Practice"
            : "▶ Start Practice"}
        </button>
      </div>
    </div>
  );
}