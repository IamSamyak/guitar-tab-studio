export default function Select({
  children,
  className = "",
  ...props
}) {
  return (
    <select
      className={`
        w-full
        rounded-xl
        border
        border-zinc-700
        bg-zinc-950
        px-3
        py-2
        text-white
        outline-none

        focus:border-blue-500

        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}