import { useNavigate } from "react-router-dom";

import Button from "../../../../shared/ui/Button";

export default function EditorHeader() {
  const navigate = useNavigate();

  return (
    <div
      className="
        flex
        flex-col
        gap-4

        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div>
        <h1 className="text-3xl font-black">
          🎸 Tab Editor
        </h1>

        <p className="text-zinc-400 mt-1">
          Create, edit and practice tabs
        </p>
      </div>

      <Button
        variant="secondary"
        onClick={() => navigate("/")}
      >
        ← Home
      </Button>
    </div>
  );
}