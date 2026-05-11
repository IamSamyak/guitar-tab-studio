export default function Input({
  className = "",
  ...props
}) {
  return (
    <input
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
        transition-all

        focus:border-blue-500

        ${className}
      `}
      {...props}
    />
  );
}