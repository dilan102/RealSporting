"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  isHomePath,
  LOADER_DURATION_MS,
  LOADER_EXIT_MS,
  markPreloaderCompleted,
  PRELOADER_EASE,
  setPreloaderPending,
  shouldShowHomePreloader,
} from "@/lib/preloader";
import {
  clearPreloaderScrollState,
  restoreScrollTargetAfterPreloader,
  saveScrollTargetBeforeUnload,
} from "@/lib/preloader-scroll";

const introText = "Club Deportivo Real Sporting";
const welcomeText = "Bienvenido";

function AnimatedWords({
  text,
  reducedMotion,
}: {
  text: string;
  reducedMotion: boolean;
}) {
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
        visible: {
          transition: {
            staggerChildren: reducedMotion ? 0 : 0.07,
            delayChildren: reducedMotion ? 0 : 0.08,
          },
        },
        exit: {
          transition: { staggerChildren: 0.04, staggerDirection: -1 },
        },
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="inline-block whitespace-nowrap"
          variants={{
            hidden: { opacity: 0, y: reducedMotion ? 0 : 18 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: reducedMotion ? 0.2 : 0.72,
                ease: PRELOADER_EASE,
              },
            },
            exit: {
              opacity: 0,
              y: reducedMotion ? 0 : -10,
              transition: { duration: 0.5, ease: PRELOADER_EASE },
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
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(() =>
    typeof window !== "undefined" ? shouldShowHomePreloader() : false,
  );
  const finishedRef = useRef(false);

  const finishPreloader = useCallback(() => {
    if (finishedRef.current) {
      return;
    }

    finishedRef.current = true;
    markPreloaderCompleted();
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

    if (!shouldShowHomePreloader()) {
      setPreloaderPending(false);
      setVisible(false);
      return;
    }

    setPreloaderPending(true);
    setVisible(true);
    finishedRef.current = false;
  }, [home]);

  useEffect(() => {
    if (!home || !visible) {
      return;
    }

    const handleBeforeUnload = () => {
      saveScrollTargetBeforeUnload();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handleBeforeUnload);

    const duration = reducedMotion ? 1200 : LOADER_DURATION_MS;
    const doneTimer = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      window.clearTimeout(doneTimer);
    };
  }, [home, visible, reducedMotion]);

  useEffect(() => {
    if (!home) {
      clearPreloaderScrollState();
    }
  }, [home]);

  if (!home) {
    return null;
  }

  const exitDuration = reducedMotion ? 0.35 : LOADER_EXIT_MS / 1000;

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
            transition: { duration: exitDuration, ease: PRELOADER_EASE },
          }}
        >
          <div className="absolute inset-0 grid-overlay opacity-40" />
          <motion.div
            aria-hidden="true"
            className="preload-glow absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: reducedMotion ? 0.35 : [0, 0.75, 0.38] }}
            transition={{
              duration: reducedMotion ? 0.4 : 3.6,
              ease: "easeInOut",
            }}
          />

          <div aria-hidden="true" className="preload-ball-stage absolute inset-x-0 bottom-[18vh]">
            <span className={`preload-ball-shadow ${reducedMotion ? "preload-ball-static" : ""}`} />
            <div
              className={`preload-ball-realistic ${reducedMotion ? "preload-ball-static" : ""}`}
            >
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: PRELOADER_EASE }}
              className="mx-auto max-w-5xl"
            >
              <h2 className="text-balance text-[clamp(1.75rem,7vw,5rem)] font-black leading-[1.04] text-text drop-shadow-2xl">
                <AnimatedWords text={introText} reducedMotion={Boolean(reducedMotion)} />
              </h2>
              <motion.p
                className="mx-auto mt-4 text-[clamp(1.3rem,5vw,3rem)] font-black leading-none text-accent drop-shadow-xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reducedMotion ? 0.1 : 0.85,
                  duration: 0.85,
                  ease: PRELOADER_EASE,
                }}
              >
                {welcomeText}
              </motion.p>
              <motion.p
                className="mx-auto mt-5 max-w-2xl text-sm font-bold uppercase tracking-[0.24em] text-accent sm:text-base"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{
                  delay: reducedMotion ? 0.15 : 1.15,
                  duration: 0.75,
                  ease: PRELOADER_EASE,
                }}
              >
                Formación, identidad y alto rendimiento
              </motion.p>
            </motion.div>
            <motion.div
              className="absolute bottom-8 left-1/2 h-1 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: PRELOADER_EASE }}
            >
              <motion.span
                className="block h-full rounded-full bg-accent"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: reducedMotion ? 0.8 : 3.5,
                  ease: PRELOADER_EASE,
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
