export default function ScreenContainer({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        min-h-screen
        bg-zinc-950
        text-white
        px-4
        py-4
        sm:px-6
        lg:px-8
        ${className}
      `}
    >
      <div className="mx-auto w-full max-w-7xl">
        {children}
      </div>
    </div>
  );
}