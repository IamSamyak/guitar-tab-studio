import Card from "../../../../shared/ui/Card";

import {
  useEditorStore,
} from "../../state/useEditorStore";

export default function TabHistory() {
  const {
    tabRows,

    currentRow,

    setCurrentRow,
  } = useEditorStore();

  return (
    <Card>
      <div className="space-y-4">
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <h2 className="text-lg font-bold">
            Sections
          </h2>

          <span className="text-sm text-zinc-500">
            {tabRows.length}
          </span>
        </div>

        <div className="space-y-3">
          {tabRows.map(
            (row, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrentRow(
                    index
                  )
                }
                className={`
                  w-full
                  rounded-xl
                  border
                  p-4
                  text-left
                  transition-all

                  ${
                    currentRow ===
                    index
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                  }
                `}
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <h3 className="font-semibold">
                      {row.name}
                    </h3>

                    <p className="text-sm text-zinc-500">
                      {
                        row.steps
                          .length
                      }{" "}
                      steps
                    </p>
                  </div>

                  <div className="text-2xl">
                    🎼
                  </div>
                </div>
              </button>
            )
          )}
        </div>
      </div>
    </Card>
  );
}