"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const introText = "Equipo Real Sporting de Usme";
const welcomeText = "Bienvenidos";

function AnimatedLetters({ text }: { text: string }) {
  return (
    <motion.span
      aria-label={text}
      className="block"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.035 } },
        exit: { transition: { staggerChildren: 0.018, staggerDirection: -1 } },
      }}
    >
      {text.split("").map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          aria-hidden="true"
          className="inline-block"
          variants={{
            hidden: {
              opacity: 0,
              y: 34,
              scale: 0.78,
              rotateX: -70,
              filter: "blur(8px)",
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              filter: "blur(0px)",
              transition: { type: "spring", stiffness: 460, damping: 24 },
            },
            exit: {
              opacity: 0,
              y: -26,
              scale: 1.08,
              filter: "blur(8px)",
              transition: { duration: 0.22 },
            },
          }}
        >
          {letter === " " ? "\u00a0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function SitePreloader() {
  const [phase, setPhase] = useState<"intro" | "welcome" | "done">("intro");

  useEffect(() => {
    const welcomeTimer = window.setTimeout(() => setPhase("welcome"), 1750);
    const doneTimer = window.setTimeout(() => setPhase("done"), 3300);

    return () => {
      window.clearTimeout(welcomeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[80] grid place-items-center overflow-hidden bg-bg text-text"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.7, ease: "easeOut" },
            }}
          >
            <Image
              src="/logo.png"
              alt=""
              width={640}
              height={640}
              priority
              className="w-[72vw] max-w-[560px] object-contain opacity-[0.14] sm:w-[48vw]"
            />
          </motion.div>

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={phase}
                className="text-balance text-5xl font-black leading-[0.95] text-text drop-shadow-2xl sm:text-7xl lg:text-8xl"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 1.02 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <AnimatedLetters text={phase === "intro" ? introText : welcomeText} />
              </motion.h2>
            </AnimatePresence>
            <motion.div
              className="mx-auto mt-8 h-1 w-28 overflow-hidden rounded-full bg-border"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.span
                className="block h-full rounded-full bg-accent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 0.85, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
