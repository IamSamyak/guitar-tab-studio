import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import ScreenContainer from "../../../shared/ui/ScreenContainer";

import FeatureCard from "../components/FeatureCard";

import { routes } from "../../../app/router/routes";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Tab Editor",
      icon: "🎼",
      description:
        "Write, edit, and organize guitar tabs with a clean workspace.",
      onClick: () =>
        navigate(routes.editor),
    },

    {
      title: "Practice",
      icon: "🎯",
      description:
        "Practice saved tabs with focused repetition and playback.",
      onClick: () =>
        navigate(routes.practice),
    },

    {
      title: "Interval Practice",
      icon: "🎧",
      description:
        "Develop interval recognition through active listening.",
      onClick: () =>
        navigate(
          routes.intervalPractice
        ),
    },

    {
      title: "Interval Quiz",
      icon: "🧠",
      description:
        "Test your ear with randomized interval challenges.",
      onClick: () =>
        navigate(
          routes.intervalQuiz
        ),
    },

    {
      title: "Sequence Quiz",
      icon: "🔥",
      description:
        "Train advanced interval memory using sequences.",
      onClick: () =>
        navigate(
          routes.sequenceQuiz
        ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, #05070d 0%, #02040a 45%, #010205 75%, #000000 100%)",
      }}
    >
      {/* BACKGROUND BLOBS */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {/* Blob 1 */}
        <motion.div
          animate={{
            x: [0, 80, -60, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "45rem",
            height: "45rem",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.03) 35%, transparent 72%)",
            filter: "blur(90px)",
          }}
        />

        {/* Blob 2 */}
        <motion.div
          animate={{
            x: [0, -100, 70, 0],
            y: [0, 60, -30, 0],
            scale: [1, 0.92, 1.08, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "20%",
            right: "-15%",
            width: "50rem",
            height: "50rem",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0.025) 40%, transparent 72%)",
            filter: "blur(110px)",
          }}
        />

        {/* Blob 3 */}
        <motion.div
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "20%",
            width: "42rem",
            height: "42rem",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(96,165,250,0.05) 0%, rgba(96,165,250,0.02) 45%, transparent 75%)",
            filter: "blur(100px)",
          }}
        />

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.72))",
          }}
        />
      </div>

      {/* CONTENT */}
      <ScreenContainer className="relative z-10 flex min-h-screen items-center py-12">
        <div className="w-full">
          {/* HERO */}
          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.05,
            }}
            className="mb-16"
          >
            <span
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-white/10
                bg-white/[0.03]
                px-4
                py-1.5
                text-[0.62rem]
                font-bold
                uppercase
                tracking-[0.28em]
                text-white/55
              "
            >
              Guitar Studio
            </span>

            <h1
              className="
                mt-6
                text-[clamp(3.2rem,9vw,7rem)]
                font-black
                leading-[0.88]
                tracking-[-0.06em]
                text-white
              "
            >
              Practice.
              <br />
              Train.
              <br />
              Create.
            </h1>

            <p
              className="
                mt-6
                max-w-2xl
                text-sm
                leading-8
                text-white/45
                lg:text-base
              "
            >
              A modern guitar workspace for
              ear training, interval practice,
              tab editing, and focused musical
              growth.
            </p>
          </motion.div>

          {/* FEATURE GRID */}
          <div
            className="
              grid
              gap-5

              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {features.map(
              (feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  index={index}
                />
              )
            )}
          </div>
        </div>
      </ScreenContainer>
    </motion.div>
  );
}