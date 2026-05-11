export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-500",

    success:
      "bg-emerald-600 hover:bg-emerald-500",

    danger:
      "bg-red-600 hover:bg-red-500",

    secondary:
      "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700",
  };

  return (
    <button
      className={`
        px-4
        py-2
        rounded-xl
        transition-all
        text-sm
        font-medium
        active:scale-95
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}