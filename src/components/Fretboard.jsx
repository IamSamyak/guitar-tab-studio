import React from "react";
import { getNoteName } from "../utils/notes";
import { getNoteColor } from "../utils/noteColors";
import { playNote, startAudio } from "../audio/sampler"; // ✅ IMPORT FIX

const STRINGS = ["E", "A", "D", "G", "B", "E"];
const STRING_ROOTS = [4, 9, 2, 7, 11, 4];
const FRETS = 16;

const CELL_WIDTH = 64;
const ROW_HEIGHT = 56;

export default function Fretboard({
  capo = 0,
  selectedNotes = [],
  setSelectedNotes,
}) {
  const isSelected = (stringIndex, fret) => {
    return selectedNotes.some(
      (n) => n.stringIndex === stringIndex && n.fret === fret
    );
  };

  const handlePlayNote = async (stringIndex, fret) => {
    if (fret < capo) return;

    // 🔥 IMPORTANT: unlock audio context (fixes error)
    await startAudio();

    const noteName = getNoteName(
      STRING_ROOTS[stringIndex],
      fret,
      0
    );

    // 🎸 play sound
    playNote(noteName);

    const alreadySelected = isSelected(stringIndex, fret);

    if (alreadySelected) {
      setSelectedNotes((prev) =>
        prev.filter(
          (n) =>
            !(n.stringIndex === stringIndex && n.fret === fret)
        )
      );
    } else {
      setSelectedNotes((prev) => [
        ...prev,
        { stringIndex, fret, note: noteName },
      ]);
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-[#2d3133] rounded-xl p-6 border border-white/5">
      <div
        className="relative"
        style={{ minWidth: `${FRETS * CELL_WIDTH + 100}px` }}
      >
        {/* 🎯 FRET NUMBERS */}
        <div
          className="flex mb-4 text-white/40 text-xs font-semibold"
          style={{ marginLeft: 100 }}
        >
          {Array.from({ length: FRETS }).map((_, i) => {
            let display = "";

            if (i === capo) display = 0;
            else if (i > capo) display = i - capo;

            return (
              <div
                key={i}
                style={{ width: CELL_WIDTH }}
                className="text-center"
              >
                {display}
              </div>
            );
          })}
        </div>

        <div className="relative">
          {/* 🎸 STRINGS */}
          <div className="relative" style={{ marginLeft: 100 }}>
            {STRINGS.map((_, sIndex) => (
              <div
                key={sIndex}
                className="relative flex items-center"
                style={{ height: ROW_HEIGHT }}
              >
                {/* String line */}
                <div
                  className="absolute left-0 right-0 bg-white/30"
                  style={{
                    height: sIndex === 0 ? "3px" : "1.5px",
                  }}
                />

                {/* Notes */}
                {Array.from({ length: FRETS }).map((_, fret) => {
                  const isBeforeCapo = fret < capo;

                  const note = getNoteName(
                    STRING_ROOTS[sIndex],
                    fret,
                    0
                  );

                  const selected = isSelected(sIndex, fret);

                  const baseNote = note.replace(/[0-9]/g, "");
                  const color = getNoteColor(baseNote);

                  return (
                    <div
                      key={fret}
                      style={{
                        width:
                          fret === capo
                            ? CELL_WIDTH + 8
                            : CELL_WIDTH,
                        position: "relative",
                      }}
                      className="flex justify-center items-center"
                    >
                      <div
                        onClick={() =>
                          !isBeforeCapo &&
                          handlePlayNote(sIndex, fret)
                        }
                        className={`
                          w-9 h-9 rounded-full 
                          flex items-center justify-center 
                          text-[11px] font-bold transition-all z-10
                          ${
                            selected
                              ? ""
                              : "bg-white/5 text-white/40 hover:bg-white/15 hover:text-white"
                          }
                          ${
                            fret === capo
                              ? "ring-2 ring-yellow-400"
                              : ""
                          }
                        `}
                        style={
                          isBeforeCapo
                            ? { visibility: "hidden" }
                            : selected
                            ? {
                                backgroundColor: color,
                                color: "#000",
                                boxShadow: `0 0 10px ${color}66`,
                              }
                            : { cursor: "pointer" }
                        }
                      >
                        {!isBeforeCapo ? note : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* 🎯 Vertical Frets */}
          <div
            className="absolute top-0 bottom-0 flex pointer-events-none"
            style={{ left: 100 }}
          >
            {Array.from({ length: FRETS }).map((_, i) => (
              <div
                key={i}
                style={{
                  width:
                    i === capo ? CELL_WIDTH + 8 : CELL_WIDTH,
                }}
                className="flex justify-start"
              >
                <div className="w-[2px] h-full bg-white/10" />
              </div>
            ))}
          </div>

          {/* 🎸 CAPO */}
          {capo > 0 && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 100 + capo * CELL_WIDTH - 10,
                  top: 0,
                  bottom: 0,
                  width: 20,
                  background:
                    "linear-gradient(to right, #ff4d4d, #cc0000)",
                  borderRadius: 6,
                  boxShadow:
                    "0 0 10px rgba(255,0,0,0.4)",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: 100 + capo * CELL_WIDTH - 16,
                  top: -18,
                  color: "#ff4d4d",
                  fontSize: 10,
                  fontWeight: "bold",
                  pointerEvents: "none",
                }}
              >
                {`Capo ${capo}`}
              </div>
            </>
          )}

          {/* 🎸 STRING LABELS */}
          <div className="absolute left-0 top-0">
            {STRINGS.map((s, i) => (
              <div
                key={i}
                style={{ height: ROW_HEIGHT }}
                className="flex items-center justify-end pr-4 text-white/70 font-bold text-base"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}