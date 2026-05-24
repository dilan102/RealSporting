"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const introText = "Equipo Real Sporting de Usme";
const welcomeText = "Bienvenidos";

function AnimatedWords({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <motion.span
      aria-label={text}
      className="flex flex-wrap justify-center gap-x-4 gap-y-3"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
        exit: { transition: { staggerChildren: 0.07, staggerDirection: -1 } },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="inline-block whitespace-nowrap"
          variants={{
            hidden: {
              opacity: 0,
              y: 28,
              scale: 0.92,
              filter: "blur(10px)",
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { type: "spring", stiffness: 360, damping: 28 },
            },
            exit: {
              opacity: 0,
              y: -22,
              scale: 0.96,
              filter: "blur(10px)",
              transition: { duration: 0.24 },
            },
          }}
        >
          {word}
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
                className="text-balance text-[clamp(2.25rem,11vw,5.8rem)] font-black leading-[1.02] text-text drop-shadow-2xl"
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -18, scale: 1.02 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <AnimatedWords text={phase === "intro" ? introText : welcomeText} />
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
