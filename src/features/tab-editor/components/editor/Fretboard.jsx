import { getNoteName } from "../../utils/notes";

const STRINGS = [
  "E",
  "A",
  "D",
  "G",
  "B",
  "E",
];

const STRING_ROOTS = [
  4,
  9,
  2,
  7,
  11,
  4,
];

const FRETS = 16;

export default function Fretboard({
  capo,
  selectedNotes,
  setSelectedNotes,
}) {
  function isSelected(
    stringIndex,
    fret
  ) {
    return selectedNotes.some(
      (n) =>
        n.stringIndex ===
          stringIndex &&
        n.fret === fret
    );
  }

  function toggleNote(
    stringIndex,
    fret
  ) {
    const note = getNoteName(
      STRING_ROOTS[stringIndex],
      fret,
      0
    );

    const exists = isSelected(
      stringIndex,
      fret
    );

    if (exists) {
      setSelectedNotes((prev) =>
        prev.filter(
          (n) =>
            !(
              n.stringIndex ===
                stringIndex &&
              n.fret === fret
            )
        )
      );

      return;
    }

    setSelectedNotes((prev) => [
      ...prev,
      {
        stringIndex,
        fret,
        note,
      },
    ]);
  }

  return (
    <div
      className="
        overflow-x-auto
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-4
      "
    >
      <div className="min-w-[1100px]">
        {/* FRET NUMBERS */}
        <div
          className="
            mb-4
            ml-16
            flex
          "
        >
          {Array.from({
            length: FRETS,
          }).map((_, i) => (
            <div
              key={i}
              className="
                w-16
                text-center
                text-xs
                text-zinc-500
              "
            >
              {i}
            </div>
          ))}
        </div>

        {/* STRINGS */}
        <div className="space-y-4">
          {STRINGS.map(
            (string, sIndex) => (
              <div
                key={string}
                className="flex items-center"
              >
                {/* LABEL */}
                <div
                  className="
                    w-16
                    text-zinc-400
                    font-bold
                  "
                >
                  {string}
                </div>

                {/* FRETS */}
                <div className="flex">
                  {Array.from({
                    length: FRETS,
                  }).map(
                    (_, fret) => {
                      const note =
                        getNoteName(
                          STRING_ROOTS[
                            sIndex
                          ],
                          fret,
                          0
                        );

                      const selected =
                        isSelected(
                          sIndex,
                          fret
                        );

                      return (
                        <div
                          key={fret}
                          className="
                            w-16
                            flex
                            justify-center
                          "
                        >
                          <button
                            onClick={() =>
                              toggleNote(
                                sIndex,
                                fret
                              )
                            }
                            className={`
                              h-10
                              w-10
                              rounded-full
                              text-xs
                              font-bold
                              transition-all

                              ${
                                selected
                                  ? "bg-orange-500 text-black"
                                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                              }
                            `}
                          >
                            {note}
                          </button>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}