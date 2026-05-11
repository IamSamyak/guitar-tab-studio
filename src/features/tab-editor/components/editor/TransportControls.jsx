import Button from "../../../../shared/ui/Button";

export default function TransportControls({
  onAddStep,
  onNewRow,
  onPlaySelection,
  onPlayTab,
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
          gap-3

          sm:grid-cols-2

          xl:grid-cols-4
        "
      >
        <Button
          variant="primary"
          onClick={onAddStep}
        >
          Add Step
        </Button>

        <Button
          variant="secondary"
          onClick={onNewRow}
        >
          New Section
        </Button>

        <Button
          variant="success"
          onClick={onPlaySelection}
        >
          Play Notes
        </Button>

        <Button
          variant="danger"
          onClick={onPlayTab}
        >
          Play Tab
        </Button>
      </div>
    </div>
  );
}