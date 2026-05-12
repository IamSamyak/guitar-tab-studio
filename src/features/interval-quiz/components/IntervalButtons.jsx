// src/features/interval-quiz/components/IntervalButtons.jsx

import { motion } from "framer-motion";

export default function IntervalButtons({
  options,
  onAnswer,
  selectedAnswer,
  showFeedback,
  correctAnswer,
}) {
  function getClasses(interval) {
    const isSelected =
      selectedAnswer?.id === interval.id;

    const isCorrect =
      correctAnswer?.id === interval.id;

    // Base classes
    let classes = `
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
    `;

    // Before answer
    if (!showFeedback) {
      classes += `
        hover:border-cyan-400/40
        hover:bg-cyan-500/10
        hover:shadow-xl
        hover:shadow-cyan-500/10
      `;
    }

    // After answer: correct option (always green)
    if (showFeedback && isCorrect) {
      classes += `
        border-emerald-400/70
        bg-emerald-500/20
        shadow-xl
        shadow-emerald-500/20
      `;
    }

    // After answer: selected wrong option (red)
    if (
      showFeedback &&
      isSelected &&
      !isCorrect
    ) {
      classes += `
        border-red-400/70
        bg-red-500/20
        shadow-xl
        shadow-red-500/20
      `;
    }

    return classes;
  }

  function getGlowClasses(interval) {
    const isSelected =
      selectedAnswer?.id === interval.id;

    const isCorrect =
      correctAnswer?.id === interval.id;

    // Correct answer glow
    if (showFeedback && isCorrect) {
      return `
        absolute
        inset-0
        opacity-100
        bg-gradient-to-br
        from-emerald-400/20
        via-emerald-500/10
        to-green-500/20
      `;
    }

    // Wrong selected glow
    if (
      showFeedback &&
      isSelected &&
      !isCorrect
    ) {
      return `
        absolute
        inset-0
        opacity-100
        bg-gradient-to-br
        from-red-400/20
        via-red-500/10
        to-rose-500/20
      `;
    }

    // Default hover glow
    return `
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
    `;
  }

  function getLabelClasses(interval) {
    const isSelected =
      selectedAnswer?.id === interval.id;

    const isCorrect =
      correctAnswer?.id === interval.id;

    if (showFeedback && isCorrect) {
      return `
        text-sm
        font-black
        tracking-tight
        text-emerald-100
        sm:text-base
      `;
    }

    if (
      showFeedback &&
      isSelected &&
      !isCorrect
    ) {
      return `
        text-sm
        font-black
        tracking-tight
        text-red-100
        sm:text-base
      `;
    }

    return `
      text-sm
      font-black
      tracking-tight
      text-white
      sm:text-base
    `;
  }

  function getBadgeClasses(interval) {
    const isSelected =
      selectedAnswer?.id === interval.id;

    const isCorrect =
      correctAnswer?.id === interval.id;

    if (showFeedback && isCorrect) {
      return `
        mt-3
        inline-flex
        rounded-full
        border border-emerald-300/30
        bg-emerald-950/40
        px-2 py-1
        text-[11px]
        font-medium
        text-emerald-200
      `;
    }

    if (
      showFeedback &&
      isSelected &&
      !isCorrect
    ) {
      return `
        mt-3
        inline-flex
        rounded-full
        border border-red-300/30
        bg-red-950/40
        px-2 py-1
        text-[11px]
        font-medium
        text-red-200
      `;
    }

    return `
      mt-3
      inline-flex
      rounded-full
      border border-white/10
      bg-black/20
      px-2 py-1
      text-[11px]
      font-medium
      text-zinc-400
    `;
  }

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
          whileHover={
            !showFeedback
              ? { scale: 1.03 }
              : {}
          }
          whileTap={
            !showFeedback
              ? { scale: 0.95 }
              : {}
          }
          onClick={() =>
            onAnswer(interval)
          }
          disabled={showFeedback}
          className={getClasses(
            interval
          )}
        >
          {/* INNER GLOW */}
          <div
            className={getGlowClasses(
              interval
            )}
          />

          <div className="relative z-10">
            <p
              className={getLabelClasses(
                interval
              )}
            >
              {interval.label}
            </p>

            <div
              className={getBadgeClasses(
                interval
              )}
            >
              {interval.semitones} st
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}