export default function PracticePanel({
  expectedNotes,
  detectedNote,
  feedback,
}) {
  return (
    <div
      className="
        rounded-3xl
        border border-white/10
        bg-zinc-900
        p-5
      "
    >
      <div className="mb-5">
        <p className="mb-2 text-sm text-zinc-500">
          Expected Notes
        </p>

        <div className="flex flex-wrap gap-2">
          {expectedNotes?.map((n) => (
            <span
              key={n.note}
              className="
                rounded-xl
                bg-zinc-800
                px-3 py-2
                font-semibold
              "
            >
              {n.note}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-zinc-500">
          Detected
        </p>

        <div
          className={`
            rounded-2xl
            p-4
            text-center
            text-3xl
            font-black
            ${
              feedback === "correct"
                ? "bg-green-500"
                : feedback === "wrong"
                ? "bg-red-500"
                : "bg-zinc-800"
            }
          `}
        >
          {detectedNote || "—"}
        </div>
      </div>
    </div>
  );
}