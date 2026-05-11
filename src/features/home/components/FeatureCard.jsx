import { motion } from "framer-motion";

export default function FeatureCard({
  title,
  icon,
  description,
  onClick,
  index = 0,
}) {
  return (
    <motion.button
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.08 + index * 0.05,
      }}
      whileHover={{
        y: -4,
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.985,
      }}
      onClick={onClick}
      className="
        group
        relative
        overflow-hidden

        rounded-[2rem]
        border
        border-white/[0.06]

        bg-white/[0.025]

        p-7

        text-left

        backdrop-blur-xl

        transition-all
        duration-300

        hover:border-white/[0.12]
        hover:bg-white/[0.04]
      "
    >
      {/* Glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0

          opacity-0

          transition-opacity
          duration-500

          group-hover:opacity-100
        "
        style={{
          background:
            "radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 55%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center

            rounded-2xl

            border
            border-white/[0.08]

            bg-white/[0.04]

            text-3xl
          "
        >
          {icon}
        </div>

        {/* Title */}
        <h2
          className="
            mt-7
            text-2xl
            font-bold
            tracking-[-0.03em]
            text-white
          "
        >
          {title}
        </h2>

        {/* Description */}
        <p
          className="
            mt-3
            text-sm
            leading-7
            text-white/40
          "
        >
          {description}
        </p>

        {/* Bottom line */}
        <div
          className="
            mt-8
            flex
            items-center
            gap-2

            text-[0.68rem]
            font-semibold
            uppercase
            tracking-[0.22em]

            text-white/25
          "
        >
          Open

          <span
            className="
              transition-transform
              duration-300

              group-hover:translate-x-1
            "
          >
            →
          </span>
        </div>
      </div>
    </motion.button>
  );
}