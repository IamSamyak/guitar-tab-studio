import { useNavigate } from "react-router-dom";

export default function PracticeNavbar() {
  const navigate = useNavigate();

  return (
    <header
      className="
        flex
        items-center
        justify-between
        border-b border-white/10
        pb-4
      "
    >
      <div>
        <h1 className="text-2xl font-bold">
          🎯 Practice Mode
        </h1>

        <p className="text-sm text-zinc-500">
          Interactive guitar practice
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="
          rounded-xl
          border border-white/10
          px-4 py-2
          text-sm
          hover:bg-white/5
        "
      >
        Exit
      </button>
    </header>
  );
}