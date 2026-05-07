import React, { useState } from "react";

import { INTERVALS } from "../data/intervalData";

import useInfinitePlayback from "../hooks/useInfinitePlayback";

import IntervalControls from "./IntervalControls";

import {
  setIntervalVolume,
} from "../services/intervalPlayer";

function IntervalPractice() {
  const [running, setRunning] =
    useState(false);

  const [mode, setMode] =
    useState("ascending");

  const [speed, setSpeed] =
    useState(3000);

  const [volume, setVolume] =
    useState(8);

  const [
    selectedInterval,
    setSelectedInterval,
  ] = useState(INTERVALS[0]);

  useInfinitePlayback({
    running,
    interval: selectedInterval,
    mode,
    speed,
  });

  /* =====================================
     HANDLE VOLUME
  ===================================== */
  function handleVolumeChange(
    value
  ) {
    const num = Number(value);

    setVolume(num);

    setIntervalVolume(num);
  }

  return (
    <div
      style={{
        padding: 20,
        color: "#fff",
      }}
    >
      <h2>
        🎧 Interval Practice
      </h2>

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
        setRunning={setRunning}
        volume={volume}
        setVolume={
          handleVolumeChange
        }
      />
    </div>
  );
}

export default IntervalPractice;