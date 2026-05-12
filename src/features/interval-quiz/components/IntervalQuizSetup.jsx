// src/features/interval-quiz/components/IntervalQuizSetup.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { INTERVALS } from "../../../theory/intervals/intervalData";
import SessionLengthSelector from "./SessionLengthSelector";
import { preloadSampler } from "../../../audio/interval/intervalPlayer";

function IntervalQuizSetup({
  selectedIntervals,
  toggleInterval,
  toggleSelectAll,
  sessionLength,
  setSessionLength,
  mode,
  setMode,
  isValid,
  handleStart,
}) {
  const [samplerReady, setSamplerReady] = useState(false);

  // Kick off sampler loading as soon as the setup screen mounts
  useEffect(() => {
    let cancelled = false;

    preloadSampler().then((ready) => {
      if (!cancelled) setSamplerReady(ready);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const canStart = isValid && samplerReady;

  const playbackModes = [
    { id: "ascending",  title: "Ascending",  subtitle: "Low → High",      icon: "↑" },
    { id: "descending", title: "Descending", subtitle: "High → Low",      icon: "↓" },
    { id: "harmonic",   title: "Harmonic",   subtitle: "Simultaneous",    icon: "≈" },
  ];

  const allSelected = selectedIntervals.length === INTERVALS.length;

  const sectionLabelStyle = {
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
    display: "block",
    marginBottom: "1rem",
  };

  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, #05070d 0%, #02040a 45%, #010205 75%, #000000 100%)",
      }}
    >
      {/* ===== MOVING CLOUD BACKGROUND ===== */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Blob 1 */}
        <motion.div
          animate={{ x: [0, 80, -60, 0], y: [0, -50, 40, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-10%", left: "-10%",
            width: "45rem", height: "45rem", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.03) 35%, transparent 72%)",
            filter: "blur(90px)",
          }}
        />
        {/* Blob 2 */}
        <motion.div
          animate={{ x: [0, -100, 70, 0], y: [0, 60, -30, 0], scale: [1, 0.92, 1.08, 1] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "20%", right: "-15%",
            width: "50rem", height: "50rem", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0.025) 40%, transparent 72%)",
            filter: "blur(110px)",
          }}
        />
        {/* Blob 3 */}
        <motion.div
          animate={{ x: [0, 60, -40, 0], y: [0, -40, 30, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", bottom: "-15%", left: "20%",
            width: "42rem", height: "42rem", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(96,165,250,0.05) 0%, rgba(96,165,250,0.02) 45%, transparent 75%)",
            filter: "blur(100px)",
          }}
        />
        {/* Blob 4 */}
        <motion.div
          animate={{ x: [0, 40, -30, 0], y: [0, 20, -20, 0], scale: [1, 1.05, 0.98, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "30%", left: "30%",
            width: "35rem", height: "35rem", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(147,197,253,0.03) 0%, rgba(147,197,253,0.01) 45%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.72))",
          }}
        />
      </div>

      {/* ===== CONTENT ===== */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "72rem",
          margin: "0 auto",
          padding: "clamp(2.5rem,8vw,5rem) clamp(1.1rem,5vw,4rem) clamp(3rem,8vw,5rem)",
          boxSizing: "border-box",
        }}
      >
        {/* ===== HERO ===== */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ marginBottom: "clamp(2.5rem,8vw,4.5rem)" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.35rem 1rem",
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            Ear Training
          </span>

          <h1
            style={{
              marginTop: "1.2rem",
              marginBottom: 0,
              fontSize: "clamp(2.7rem,10vw,6.5rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              color: "#ffffff",
            }}
          >
            Interval
            <br />
            Quiz
          </h1>

          <p
            style={{
              marginTop: "1rem",
              maxWidth: "38rem",
              fontSize: "clamp(0.9rem,2vw,1rem)",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            Train your ears to recognize intervals with focused listening
            sessions and distraction-free design.
          </p>
        </motion.section>

        {/* ===== INTERVAL SELECTION ===== */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: "clamp(2.5rem,8vw,4rem)" }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <span style={sectionLabelStyle}>Select Intervals</span>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
                {selectedIntervals.length} of {INTERVALS.length} selected
              </p>
            </div>

            <button
              onClick={toggleSelectAll}
              style={{
                border: "none",
                background: "transparent",
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {allSelected ? "Clear All" : "Select All"}
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(4rem, 1fr))",
              gap: "0.6rem",
            }}
          >
            {INTERVALS.map((interval) => {
              const selected = selectedIntervals.some((i) => i.id === interval.id);
              return (
                <motion.button
                  key={interval.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleInterval(interval)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "1rem",
                    border: selected
                      ? "1px solid rgba(255,255,255,0.14)"
                      : "1px solid rgba(255,255,255,0.06)",
                    background: selected
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.025)",
                    color: selected ? "#ffffff" : "rgba(255,255,255,0.45)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  {interval.short}
                </motion.button>
              );
            })}
          </div>

          {!isValid && (
            <p style={{ marginTop: "0.8rem", fontSize: "0.74rem", color: "rgba(255,200,120,0.75)" }}>
              Select at least 2 intervals to begin.
            </p>
          )}
        </motion.section>

        {/* ===== SESSION + PLAYBACK ===== */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          <div>
            <span style={sectionLabelStyle}>Session Length</span>
            <SessionLengthSelector value={sessionLength} onChange={setSessionLength} />
          </div>

          <div>
            <span style={sectionLabelStyle}>Playback Mode</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {playbackModes.map((item) => {
                const selected = mode === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.9rem",
                      padding: "0.9rem 1rem",
                      borderRadius: "1rem",
                      border: selected
                        ? "1px solid rgba(255,255,255,0.12)"
                        : "1px solid rgba(255,255,255,0.05)",
                      background: selected
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.02)",
                      color: selected ? "#ffffff" : "rgba(255,255,255,0.45)",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ width: "1.5rem", textAlign: "center", opacity: 0.7 }}>
                      {item.icon}
                    </span>
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{item.title}</div>
                      <div
                        style={{
                          marginTop: "0.15rem",
                          fontSize: "0.62rem",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.28)",
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ===== START BUTTON ===== */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileHover={canStart ? { scale: 1.01 } : {}}
            whileTap={canStart ? { scale: 0.985 } : {}}
            onClick={handleStart}
            disabled={!canStart}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "1.25rem",
              padding: "1.15rem 1.5rem",
              background: canStart
                ? "rgba(255,255,255,0.10)"
                : "rgba(255,255,255,0.03)",
              color: canStart ? "#ffffff" : "rgba(255,255,255,0.20)",
              fontSize: "0.76rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              cursor: canStart ? "pointer" : "not-allowed",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              transition: "background 0.3s, color 0.3s",
            }}
          >
            {!samplerReady ? "Loading Audio…" : "Start Training"}
          </motion.button>
        </motion.section>
      </div>
    </motion.div>
  );
}

export default IntervalQuizSetup;