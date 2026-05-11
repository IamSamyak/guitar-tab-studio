// src/features/interval-quiz/components/QuizScore.jsx

import { motion } from "framer-motion";

export default function QuizScore({
  score,
  total,
  lastResult,
}) {
  const accuracy =
    total === 0
      ? 0
      : Math.round(
          (score / total) * 100
        );

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        rounded-[32px]
        border border-white/10
        bg-white/5
        p-6
        shadow-2xl
        backdrop-blur-2xl
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-zinc-400">
            Score
          </p>

          <div className="mt-2 text-5xl font-black">
            {score}
            <span className="text-zinc-500">
              /{total}
            </span>
          </div>
        </div>

        <div
          className="
            flex
            h-24
            w-24
            items-center
            justify-center
            rounded-full
            border border-white/10
            bg-gradient-to-br
            from-blue-500/20
            to-purple-500/20
            text-2xl
            font-black
          "
        >
          {accuracy}%
        </div>
      </div>

      {lastResult !== null && (
        <motion.div
          key={String(lastResult)}
          initial={{
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className={`
            mt-5
            rounded-2xl
            p-4
            text-center
            text-lg
            font-bold
            ${
              lastResult
                ? `
                  bg-green-500/10
                  text-green-400
                `
                : `
                  bg-red-500/10
                  text-red-400
                `
            }
          `}
        >
          {lastResult
            ? "✅ Correct"
            : "❌ Wrong"}
        </motion.div>
      )}
    </motion.div>
  );
}