"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  isHardReloadOnHome,
  isHomePath,
  LOADER_DURATION_MS,
  LOADER_EXIT_MS,
  setPreloaderPending,
} from "@/lib/preloader";
import {
  clearPreloaderScrollState,
  restoreScrollTargetAfterPreloader,
  saveScrollTargetBeforeUnload,
} from "@/lib/preloader-scroll";

const introText = "Club Deportivo Real Sporting";
const welcomeText = "Bienvenido";
const smoothEase = [0.45, 0.05, 0.2, 1] as const;

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
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
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
              y: 22,
              scale: 0.96,
              filter: "blur(8px)",
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { type: "spring", stiffness: 260, damping: 32, mass: 0.9 },
            },
            exit: {
              opacity: 0,
              y: -14,
              scale: 0.98,
              filter: "blur(6px)",
              transition: { duration: 0.45, ease: smoothEase },
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
  const [isReload] = useState(() =>
    typeof window !== "undefined" ? isHardReloadOnHome() : false,
  );
  const shouldRun = home && isReload;
  const [visible, setVisible] = useState(shouldRun);
  const finishedRef = useRef(false);

  const finishPreloader = useCallback(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    setPreloaderPending(false);
    document.documentElement.classList.add("preloader-done");
    document.documentElement.classList.remove("preloader-active");

    window.requestAnimationFrame(() => {
      restoreScrollTargetAfterPreloader();
    });
  }, []);

  useLayoutEffect(() => {
    if (!home) {
      setPreloaderPending(false);
      setVisible(false);
      return;
    }

    if (!isHardReloadOnHome()) {
      setPreloaderPending(false);
      setVisible(false);
      return;
    }

    setPreloaderPending(true);
    setVisible(true);
    finishedRef.current = false;
  }, [home]);

  useEffect(() => {
    if (!shouldRun) {
      return;
    }

    const handleBeforeUnload = () => {
      saveScrollTargetBeforeUnload();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);

    const doneTimer = window.setTimeout(() => {
      setVisible(false);
    }, LOADER_DURATION_MS);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      window.clearTimeout(doneTimer);
    };
  }, [shouldRun]);

  useEffect(() => {
    if (!home) {
      clearPreloaderScrollState();
    }
  }, [home]);

  if (!home) {
    return null;
  }

  return (
    <AnimatePresence mode="wait" onExitComplete={finishPreloader}>
      {visible && (
        <motion.div
          key="site-preloader"
          role="status"
          aria-live="polite"
          className="site-preloader-root pointer-events-auto fixed inset-0 overflow-hidden bg-bg text-text"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: LOADER_EXIT_MS / 1000, ease: smoothEase },
          }}
        >
          <div className="absolute inset-0 grid-overlay opacity-45" />
          <motion.div
            aria-hidden="true"
            className="preload-glow absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0.4] }}
            transition={{ duration: 3.2, ease: "easeInOut" }}
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
              initial={{ opacity: 0, y: 16, scale: 0.99 }}
              animate={{ opacity: [0, 1, 1, 0.85], y: [16, 0, 0, -8] }}
              transition={{
                duration: 3.4,
                ease: smoothEase,
                times: [0, 0.18, 0.82, 1],
              }}
              className="mx-auto max-w-5xl"
            >
              <h2 className="text-balance text-[clamp(1.75rem,7vw,5rem)] font-black leading-[1.04] text-text drop-shadow-2xl">
                <AnimatedWords text={introText} />
              </h2>
              <motion.p
                className="mx-auto mt-4 text-[clamp(1.3rem,5vw,3rem)] font-black leading-none text-accent drop-shadow-xl"
                initial={{ opacity: 0, y: 14, scale: 0.97, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{
                  delay: 0.72,
                  type: "spring",
                  stiffness: 240,
                  damping: 30,
                  mass: 0.85,
                }}
              >
                {welcomeText}
              </motion.p>
              <motion.p
                className="mx-auto mt-5 max-w-2xl text-sm font-bold uppercase tracking-[0.24em] text-accent sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.92, y: 0 }}
                transition={{ delay: 1.05, duration: 0.8, ease: smoothEase }}
              >
                Formación, identidad y alto rendimiento
              </motion.p>
            </motion.div>
            <motion.div
              className="absolute bottom-8 left-1/2 h-1 w-44 -translate-x-1/2 overflow-hidden rounded-full bg-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3.4, ease: smoothEase, times: [0, 0.15, 0.85, 1] }}
            >
              <motion.span
                className="block h-full rounded-full bg-accent"
                initial={{ x: "-105%" }}
                animate={{ x: "110%" }}
                transition={{ duration: 3.1, ease: smoothEase }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
