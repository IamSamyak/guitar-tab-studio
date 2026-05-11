export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-4
        shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
}