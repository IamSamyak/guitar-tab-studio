import React from "react";

import { INTERVALS } from "../data/intervalData";

function IntervalControls({
  selectedInterval,
  setSelectedInterval,
  mode,
  setMode,
  speed,
  setSpeed,
  running,
  setRunning,
  volume,
  setVolume,
}) {
  const selectStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "#2a2a2a",
    color: "#ffffff",
    border: "1px solid #444",
    borderRadius: 8,
    outline: "none",
    fontSize: 14,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 20,
        background: "#181818",
        borderRadius: 12,
        border: "1px solid #333",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.35)",
        color: "#ffffff",
        width: "100%",
      }}
    >
      {/* INTERVAL */}
      <div>
        <div
          style={{
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 500,
            color: "#cccccc",
          }}
        >
          Interval
        </div>

        <select
          value={
            selectedInterval.id
          }
          onChange={(e) => {
            const found =
              INTERVALS.find(
                (i) =>
                  i.id ===
                  e.target.value
              );

            setSelectedInterval(
              found
            );
          }}
          style={selectStyle}
        >
          {INTERVALS.map(
            (interval) => (
              <option
                key={interval.id}
                value={
                  interval.id
                }
                style={{
                  background:
                    "#2a2a2a",
                  color:
                    "#ffffff",
                }}
              >
                {interval.label}
              </option>
            )
          )}
        </select>
      </div>

      {/* MODE */}
      <div>
        <div
          style={{
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 500,
            color: "#cccccc",
          }}
        >
          Playback Mode
        </div>

        <select
          value={mode}
          onChange={(e) =>
            setMode(
              e.target.value
            )
          }
          style={selectStyle}
        >
          <option
            value="ascending"
            style={{
              background:
                "#2a2a2a",
              color:
                "#ffffff",
            }}
          >
            Ascending
          </option>

          <option
            value="descending"
            style={{
              background:
                "#2a2a2a",
              color:
                "#ffffff",
            }}
          >
            Descending
          </option>

          <option
            value="harmonic"
            style={{
              background:
                "#2a2a2a",
              color:
                "#ffffff",
            }}
          >
            Harmonic
          </option>
        </select>
      </div>

      {/* SPEED */}
      <div>
        <div
          style={{
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 500,
            color: "#cccccc",
          }}
        >
          Speed (
          {speed / 1000}s)
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
          style={{
            width: "100%",
            cursor: "pointer",
            accentColor:
              "#00aa55",
          }}
        />
      </div>

      {/* VOLUME */}
      <div>
        <div
          style={{
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 500,
            color: "#cccccc",
          }}
        >
          🔊 Volume ({volume}
          dB)
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
          style={{
            width: "100%",
            cursor: "pointer",
            accentColor:
              "#ff9800",
          }}
        />
      </div>

      {/* START / STOP */}
      <button
        onClick={() =>
          setRunning(
            !running
          )
        }
        style={{
          padding:
            "12px 16px",
          border: "none",
          borderRadius: 8,
          background: running
            ? "#ff4444"
            : "#00aa55",
          color: "#ffffff",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          transition:
            "0.2s ease",
        }}
      >
        {running
          ? "Stop Practice"
          : "Start Practice"}
      </button>
    </div>
  );
}

export default IntervalControls;