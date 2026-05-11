export default function SequenceOptions({
  options,
  onAnswer,
}) {
  return (
    <div className="grid gap-3">
      {options.map(
        (option, index) => {
          // support:
          // [intervals]
          // { sequence: [...] }

          const sequence =
            Array.isArray(option)
              ? option
              : option.sequence || [];

          return (
            <button
              key={index}
              onClick={() =>
                onAnswer(option)
              }
              className="
                rounded-2xl
                border border-white/10
                bg-zinc-900
                p-4
                text-left
                hover:bg-zinc-800
              "
            >
              <div className="mb-2 font-bold">
                {String.fromCharCode(
                  65 + index
                )}
              </div>

              <div className="text-zinc-300">
                {sequence
                  .map(
                    (i) => i.label
                  )
                  .join(" → ")}
              </div>
            </button>
          );
        }
      )}
    </div>
  );
}