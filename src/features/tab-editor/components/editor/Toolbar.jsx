import Button from "../../../../shared/ui/Button";

export default function Toolbar({
  capo,
  setCapo,

  tempo,
  setTempo,

  onSave,
  onExport,
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-4
      "
    >
      <div
        className="
          grid
          gap-4

          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {/* CAPO */}
        <div>
          <label className="text-sm text-zinc-400">
            Capo
          </label>

          <input
            type="number"
            min={0}
            max={12}
            value={capo}
            onChange={(e) =>
              setCapo(
                Number(
                  e.target.value
                )
              )
            }
            className="
              mt-2
              w-full
              rounded-xl
              border
              border-zinc-700
              bg-zinc-950
              px-3
              py-2
            "
          />
        </div>

        {/* TEMPO */}
        <div>
          <label className="text-sm text-zinc-400">
            Tempo ({tempo})
          </label>

          <input
            type="range"
            min={40}
            max={240}
            value={tempo}
            onChange={(e) =>
              setTempo(
                Number(
                  e.target.value
                )
              )
            }
            className="
              mt-4
              w-full
            "
          />
        </div>

        {/* SAVE */}
        <div className="flex items-end">
          <Button
            className="w-full"
            onClick={onSave}
          >
            Save
          </Button>
        </div>

        {/* EXPORT */}
        <div className="flex items-end">
          <Button
            variant="success"
            className="w-full"
            onClick={onExport}
          >
            Export PDF
          </Button>
        </div>
      </div>
    </div>
  );
}