"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const introText = "Club Deportivo Real Sporting";
const loaderDuration = 3300;

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
  const [done, setDone] = useState(false);

  useEffect(() => {
    const doneTimer = window.setTimeout(() => setDone(true), loaderDuration);

    return () => {
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-0 z-[80] overflow-hidden bg-bg text-text"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }}
        >
          <div className="absolute inset-0 grid-overlay opacity-55" />
          <motion.div
            aria-hidden="true"
            className="preload-glow absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.45] }}
            transition={{ duration: 2.6, ease: "easeInOut" }}
          />

          <motion.div
            aria-hidden="true"
            className="preload-ball absolute left-0 top-0"
            initial={{ x: "8vw", y: "72vh", scale: 1.05, rotate: 0, opacity: 1 }}
            animate={{
              x: ["8vw", "76vw", "18vw", "64vw", "50vw"],
              y: ["72vh", "18vh", "34vh", "70vh", "50vh"],
              rotate: [0, 520, 1020, 1480, 1880],
              scale: [1.05, 0.95, 1.08, 0.92, 0.08],
              opacity: [1, 1, 1, 0.95, 0],
            }}
            transition={{
              duration: 2.85,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.28, 0.52, 0.78, 1],
            }}
          />

          <div className="relative z-10 grid min-h-screen place-items-center px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -12] }}
              transition={{ duration: 2.9, ease: "easeOut", times: [0, 0.22, 0.78, 1] }}
              className="mx-auto max-w-5xl"
            >
              <h2 className="text-balance text-[clamp(1.75rem,7vw,5rem)] font-black leading-[1.04] text-text drop-shadow-2xl">
                <AnimatedWords text={introText} />
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm font-bold uppercase tracking-[0.24em] text-accent sm:text-base">
                Formación, identidad y alto rendimiento
              </p>
            </motion.div>
            <motion.div
              className="absolute bottom-8 left-1/2 h-1 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.9, times: [0, 0.2, 0.8, 1] }}
            >
              <motion.span
                className="block h-full rounded-full bg-accent"
                initial={{ x: "-100%" }}
                animate={{ x: "115%" }}
                transition={{ duration: 2.65, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
