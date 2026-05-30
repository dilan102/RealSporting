"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  clearPreloaderScrollState,
  restoreScrollTargetAfterPreloader,
  saveScrollTargetBeforeUnload,
} from "@/lib/preloader-scroll";

const introText = "Club Deportivo Real Sporting";
const welcomeText = "Bienvenido";
const loaderDuration = 3300;

function isHomePath(pathname: string) {
  return pathname === "/" || pathname === "";
}

function setPreloaderPending(active: boolean) {
  document.documentElement.classList.toggle("preloader-pending", active);
}

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
  const pathname = usePathname();
  const home = isHomePath(pathname);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (!home) {
      setPreloaderPending(false);
      setVisible(false);
      return;
    }

    setPreloaderPending(true);
    setVisible(true);
  }, [home]);

  useEffect(() => {
    if (!home) {
      return;
    }

    const handleBeforeUnload = () => {
      saveScrollTargetBeforeUnload();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);

    const doneTimer = window.setTimeout(() => {
      setVisible(false);
      setPreloaderPending(false);
      document.documentElement.classList.add("preloader-done");

      window.requestAnimationFrame(() => {
        restoreScrollTargetAfterPreloader();
      });
    }, loaderDuration);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      window.clearTimeout(doneTimer);
    };
  }, [home]);

  useEffect(() => {
    if (!home) {
      clearPreloaderScrollState();
    }
  }, [home]);

  if (!home) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="site-preloader"
          role="status"
          aria-live="polite"
          className="site-preloader-root pointer-events-auto fixed inset-0 overflow-hidden bg-bg text-text"
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

          <div aria-hidden="true" className="preload-ball-stage absolute inset-x-0 bottom-[18vh]">
            <span className="preload-ball-shadow" />
            <div className="preload-ball-realistic">
              <Image
                src="/balon.png"
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 160px, 220px"
                priority
              />
            </div>
          </div>

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
              <motion.p
                className="mx-auto mt-4 text-[clamp(1.3rem,5vw,3rem)] font-black leading-none text-accent drop-shadow-xl"
                initial={{ opacity: 0, y: 18, scale: 0.94, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, scale: 0.96, filter: "blur(10px)" }}
                transition={{ delay: 0.58, type: "spring", stiffness: 300, damping: 26 }}
              >
                {welcomeText}
              </motion.p>
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
