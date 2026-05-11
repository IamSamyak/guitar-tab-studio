export default function SequenceLengthSelector({
  value,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-zinc-400">
        Sequence Length
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(
            Number(e.target.value)
          )
        }
        className="
          w-full
          rounded-xl
          border border-white/10
          bg-zinc-900
          p-3
        "
      >
        <option value={2}>
          2 Intervals
        </option>

        <option value={3}>
          3 Intervals
        </option>

        <option value={4}>
          4 Intervals
        </option>

        <option value={5}>
          5 Intervals
        </option>
      </select>
    </div>
  );
}