// src/features/interval-quiz/components/IntervalQuiz.jsx

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import useQuizEngine from "../hooks/useQuizEngine";
import { INTERVALS } from "../../../theory/intervals/intervalData";

import IntervalButtons from "./IntervalButtons";
import QuizScore from "./QuizScore";
import ResultsScreen from "./ResultsScreen";
import IntervalQuizSetup from "./IntervalQuizSetup";

// ─────────────────────────────────────────────────────────────────────────────
// Waveform Visualizer
// ─────────────────────────────────────────────────────────────────────────────
function WaveformBars() {
  const heights = [12, 24, 36, 20, 32, 14, 28, 38, 18, 30];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: "clamp(3px, 0.8vw, 6px)",
        height: "clamp(2.5rem, 6vw, 3.5rem)",
        width: "100%",
      }}
    >
      {heights.map((h, i) => (
        <motion.div
          key={i}
          style={{
            width: "clamp(5px, 1vw, 8px)",
            height: h,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.55)",
            flexShrink: 0,
          }}
          animate={{
            scaleY: [0.7, 1.3, 0.7],
          }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            delay: i * 0.09,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
function IntervalQuiz() {
  const [mode, setMode] = useState("ascending");
  const [screen, setScreen] = useState("setup");
  const [sessionLength, setSessionLength] = useState(10);
  const [selectedIntervals, setSelectedIntervals] = useState([]);

  const {
    score,
    total,
    lastResult,
    sessionComplete,
    weakIntervals,
    recommendations,
    submitAnswer,
    replay,
    startQuiz,
    resetQuiz,
    finishSession,
  } = useQuizEngine(
    mode,
    selectedIntervals,
    sessionLength
  );

  const isValid =
    selectedIntervals.length >= 2;

  useEffect(() => {
    if (
      screen === "quiz" &&
      sessionComplete
    ) {
      setScreen("results");
    }
  }, [screen, sessionComplete]);

  function toggleSelectAll() {
    setSelectedIntervals(
      selectedIntervals.length ===
        INTERVALS.length
        ? []
        : [...INTERVALS]
    );
  }

  function toggleInterval(interval) {
    setSelectedIntervals((prev) => {
      const exists = prev.some(
        (i) => i.id === interval.id
      );

      return exists
        ? prev.filter(
            (i) => i.id !== interval.id
          )
        : [...prev, interval];
    });
  }

  function handleStart() {
    if (!isValid) return;

    startQuiz();
    setScreen("quiz");
  }

  function handleBackToSetup() {
    resetQuiz();
    setScreen("setup");
  }

  function handleRestart() {
    startQuiz();
    setScreen("quiz");
  }

  const progressPercent =
    sessionLength === "infinite"
      ? 100
      : Math.min(
          (total / sessionLength) * 100,
          100
        );

  const sectionLabel = {
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100svh",
        width: "100%",
        overflowX: "hidden",
        color: "#ffffff",
        background:
          "radial-gradient(circle at top, #05070d 0%, #02040a 45%, #010205 75%, #000000 100%)",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
        }}
      >
        <AnimatePresence mode="wait">
          {/* SETUP SCREEN */}
          {screen === "setup" && (
            <IntervalQuizSetup
              selectedIntervals={
                selectedIntervals
              }
              toggleInterval={
                toggleInterval
              }
              toggleSelectAll={
                toggleSelectAll
              }
              sessionLength={
                sessionLength
              }
              setSessionLength={
                setSessionLength
              }
              mode={mode}
              setMode={setMode}
              isValid={isValid}
              handleStart={
                handleStart
              }
            />
          )}

          {/* QUIZ SCREEN */}
          {screen === "quiz" && (
            <motion.div
              key="quiz"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.4,
              }}
              style={{
                width: "100%",
                minHeight: "100svh",
                padding:
                  "clamp(1rem,3vw,3rem)",
                boxSizing:
                  "border-box",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(340px,1fr))",
                gap:
                  "clamp(1.5rem,3vw,3rem)",
                alignItems: "start",
              }}
            >
              {/* LEFT SIDE */}
              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "1.5rem",
                }}
              >
                {/* HEADER */}
                <section>
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-start",
                      gap: "1rem",
                      marginBottom:
                        "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <p
                        style={
                          sectionLabel
                        }
                      >
                        Current Session
                      </p>

                      <h1
                        style={{
                          marginTop:
                            "0.5rem",
                          marginBottom: 0,
                          fontSize:
                            "clamp(2.4rem,5vw,5rem)",
                          fontWeight: 900,
                          lineHeight:
                            0.95,
                          letterSpacing:
                            "-0.05em",
                          color:
                            "#ffffff",
                        }}
                      >
                        Interval
                        <br />
                        Identification
                      </h1>
                    </div>

                    <div
                      style={{
                        borderRadius:
                          "1.2rem",
                        border:
                          "1px solid rgba(255,255,255,0.08)",
                        background:
                          "rgba(255,255,255,0.04)",
                        backdropFilter:
                          "blur(14px)",
                        padding:
                          "0.9rem 1.2rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily:
                            "monospace",
                          fontSize:
                            "clamp(1.5rem,4vw,2.6rem)",
                          fontWeight: 900,
                          color:
                            "#ffffff",
                        }}
                      >
                        {String(
                          total
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span
                        style={{
                          marginLeft:
                            "0.35rem",
                          fontFamily:
                            "monospace",
                          fontSize:
                            "clamp(0.9rem,2vw,1.1rem)",
                          color:
                            "rgba(255,255,255,0.28)",
                        }}
                      >
                        /
                        {sessionLength ===
                        "infinite"
                          ? "∞"
                          : String(
                              sessionLength
                            ).padStart(
                              2,
                              "0"
                            )}
                      </span>
                    </div>
                  </div>

                  {sessionLength !==
                    "infinite" && (
                    <div
                      style={{
                        height: 5,
                        borderRadius:
                          9999,
                        background:
                          "rgba(255,255,255,0.05)",
                        overflow:
                          "hidden",
                      }}
                    >
                      <motion.div
                        animate={{
                          width: `${progressPercent}%`,
                        }}
                        transition={{
                          duration:
                            0.4,
                        }}
                        style={{
                          height:
                            "100%",
                          borderRadius:
                            9999,
                          background:
                            "rgba(255,255,255,0.5)",
                        }}
                      />
                    </div>
                  )}
                </section>

                {/* SCORE */}
                <QuizScore
                  score={score}
                  total={total}
                  lastResult={
                    lastResult
                  }
                />

                {/* FINISH BUTTON */}
                <motion.button
                  whileHover={{
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.985,
                  }}
                  onClick={
                    finishSession
                  }
                  style={{
                    width: "100%",
                    border: "none",
                    borderRadius:
                      "1rem",
                    padding:
                      "1rem 1.25rem",
                    background:
                      "rgba(255,255,255,0.05)",
                    color:
                      "rgba(255,255,255,0.65)",
                    fontSize:
                      "0.72rem",
                    fontWeight: 700,
                    letterSpacing:
                      "0.22em",
                    textTransform:
                      "uppercase",
                    cursor:
                      "pointer",
                  }}
                >
                  Finish Session
                </motion.button>
              </div>

              {/* RIGHT SIDE */}
              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "1.5rem",
                }}
              >
                {/* PLAYER */}
                <section
                  style={{
                    borderRadius:
                      "2rem",
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                    background:
                      "rgba(255,255,255,0.03)",
                    backdropFilter:
                      "blur(20px)",
                    padding:
                      "clamp(1.5rem,4vw,3rem)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection:
                        "column",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      gap: "1.5rem",
                    }}
                  >
                    <WaveformBars />

                    <motion.button
                      whileTap={{
                        scale: 0.93,
                      }}
                      onClick={replay}
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        width:
                          "clamp(7rem,14vw,10rem)",
                        height:
                          "clamp(7rem,14vw,10rem)",
                        borderRadius:
                          "50%",
                        border:
                          "1px solid rgba(255,255,255,0.10)",
                        background:
                          "rgba(255,255,255,0.06)",
                        color:
                          "#ffffff",
                        fontSize:
                          "clamp(2.8rem,5vw,4rem)",
                        cursor:
                          "pointer",
                        backdropFilter:
                          "blur(12px)",
                      }}
                    >
                      🔊
                    </motion.button>

                    <div
                      style={{
                        textAlign:
                          "center",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize:
                            "clamp(0.9rem,2vw,1rem)",
                          color:
                            "rgba(255,255,255,0.55)",
                        }}
                      >
                        Tap to listen
                      </p>

                      <p
                        style={{
                          marginTop:
                            "0.35rem",
                          fontSize:
                            "0.62rem",
                          fontWeight: 700,
                          letterSpacing:
                            "0.26em",
                          textTransform:
                            "uppercase",
                          color:
                            "rgba(255,255,255,0.22)",
                        }}
                      >
                        {mode}
                      </p>
                    </div>
                  </div>
                </section>

                {/* ANSWERS */}
                <section>
                  <IntervalButtons
                    options={
                      selectedIntervals
                    }
                    onAnswer={
                      submitAnswer
                    }
                  />
                </section>
              </div>
            </motion.div>
          )}

          {/* RESULTS SCREEN */}
          {screen === "results" && (
            <motion.div
              key="results"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.4,
              }}
              style={{
                width: "100%",
              }}
            >
              <ResultsScreen
                score={score}
                total={total}
                weakIntervals={
                  weakIntervals
                }
                recommendations={
                  recommendations
                }
                onRestart={
                  handleRestart
                }
                onBack={
                  handleBackToSetup
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default IntervalQuiz;