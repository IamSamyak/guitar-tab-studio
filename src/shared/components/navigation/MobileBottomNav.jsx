import {
  Music2,
  Headphones,
  Guitar,
  Brain,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function MobileBottomNav() {
  const navigate = useNavigate();

  return (
    <div
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50

        border-t
        border-zinc-800

        bg-zinc-950/95
        backdrop-blur

        md:hidden
      "
    >
      <div
        className="
          grid
          grid-cols-4
        "
      >
        <NavItem
          icon={<Guitar size={20} />}
          label="Editor"
          onClick={() =>
            navigate("/editor")
          }
        />

        <NavItem
          icon={
            <Music2 size={20} />
          }
          label="Practice"
          onClick={() =>
            navigate("/practice")
          }
        />

        <NavItem
          icon={
            <Headphones size={20} />
          }
          label="Intervals"
          onClick={() =>
            navigate(
              "/ear-training/practice"
            )
          }
        />

        <NavItem
          icon={<Brain size={20} />}
          label="Quiz"
          onClick={() =>
            navigate(
              "/ear-training/quiz"
            )
          }
        />
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
        flex
        flex-col
        items-center
        gap-1

        py-3

        text-xs
        text-zinc-400

        transition-all

        active:scale-95
      "
    >
      {icon}

      <span>{label}</span>
    </button>
  );
}