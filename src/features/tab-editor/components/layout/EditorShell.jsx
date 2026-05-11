export default function EditorShell({
  sidebar,
  controls,
  fretboard,
}) {
  return (
    <div
      className="
        grid
        gap-6

        xl:grid-cols-[360px_1fr]
      "
    >
      {/* LEFT SIDE */}
      <div className="space-y-6">
        {sidebar}

        <div className="xl:hidden">
          {controls}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6">
        <div className="hidden xl:block">
          {controls}
        </div>

        {fretboard}
      </div>
    </div>
  );
}