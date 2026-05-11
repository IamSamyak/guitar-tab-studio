// src/features/interval-quiz/components/IntervalButtons.jsx

import { motion } from "framer-motion";

export default function IntervalButtons({
  options,
  onAnswer,
}) {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:grid-cols-3
      "
    >
      {options.map((interval) => (
        <motion.button
          key={interval.id}
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={() =>
            onAnswer(interval.id)
          }
          className="
            group
            relative
            overflow-hidden

            min-h-[92px]

            rounded-[26px]

            border border-white/10

            bg-white/5

            px-3
            py-4

            backdrop-blur-2xl

            transition-all
            duration-300

            hover:border-cyan-400/40
            hover:bg-cyan-500/10
            hover:shadow-xl
            hover:shadow-cyan-500/10
          "
        >
          {/* INNER GLOW */}
          <div
            className="
              absolute
              inset-0
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100

              bg-gradient-to-br
              from-cyan-500/10
              via-blue-500/10
              to-purple-500/10
            "
          />

          <div className="relative z-10">
            <p
              className="
                text-sm
                font-black
                tracking-tight
                text-white
                sm:text-base
              "
            >
              {interval.label}
            </p>

            <div
              className="
                mt-3
                inline-flex
                rounded-full
                border border-white/10
                bg-black/20
                px-2 py-1
                text-[11px]
                font-medium
                text-zinc-400
              "
            >
              {
                interval.semitones
              }{" "}
              st
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}