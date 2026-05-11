const OPTIONS = [10, 20, 50, "infinite"];

export default function SessionLengthSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map((option) => {
        const selected = value === option;

        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`
              min-h-[60px]
              rounded-2xl
              border
              font-semibold
              transition-all
              ${
                selected
                  ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-300"
                  : "border-white/10 bg-white/5 text-zinc-300"
              }
            `}
          >
            {option === "infinite" ? "Infinite" : `${option} Questions`}
          </button>
        );
      })}
    </div>
  );
}