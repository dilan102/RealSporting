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

const pillars = ["DISCIPLINA", "COMUNIDAD", "EXCELENCIA", "RESPETO"];

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
    if (!home || !shouldShowHomePreloader()) {
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

    const duration = reducedMotion ? 1000 : LOADER_DURATION_MS;
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

  const exitDuration = reducedMotion ? 0.2 : LOADER_EXIT_MS / 1000;

  return (
    <AnimatePresence mode="wait" onExitComplete={finishPreloader}>
      {visible && (
        <motion.div
          key="site-preloader"
          role="status"
          aria-live="polite"
          className="site-preloader-root pointer-events-auto fixed inset-0 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: exitDuration, ease: PRELOADER_EASE },
          }}
        >
          <div className="site-preloader-glow" aria-hidden="true" />
          <div className="site-preloader-divider site-preloader-divider-top" aria-hidden="true" />
          <div className="site-preloader-divider site-preloader-divider-bottom" aria-hidden="true" />

          <div className="relative z-10 grid min-h-screen place-items-center px-5 text-center">
            <div className="mx-auto flex min-h-[430px] w-full max-w-4xl flex-col items-center justify-center">
              <motion.p
                className="font-hero text-6xl font-black uppercase leading-none tracking-normal sm:text-7xl lg:text-9xl"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0.2 : 0.72, ease: PRELOADER_EASE }}
              >
                Real Sporting
              </motion.p>

              <div className="relative mt-7 h-12 w-full max-w-xl overflow-hidden">
                {pillars.map((word, index) => (
                  <motion.span
                    key={word}
                    className="site-preloader-pillar font-training absolute inset-0 flex items-center justify-center text-lg font-black uppercase tracking-normal sm:text-2xl"
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                    animate={{
                      opacity: reducedMotion ? (index === 0 ? 1 : 0) : [0, 1, 1, 0],
                      y: 0,
                    }}
                    transition={{
                      delay: reducedMotion ? 0 : 0.68 + index * 0.58,
                      duration: reducedMotion ? 0.1 : 0.78,
                      ease: PRELOADER_EASE,
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              <motion.div
                className="site-preloader-logo-ring mt-8 grid size-24 place-items-center rounded-full p-4 backdrop-blur sm:size-28"
                initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: reducedMotion ? 0.15 : 2.55,
                  duration: reducedMotion ? 0.2 : 0.72,
                  ease: PRELOADER_EASE,
                }}
              >
                <Image
                  src="/logo.png"
                  alt=""
                  width={86}
                  height={86}
                  className="object-contain"
                  priority
                  aria-hidden="true"
                />
              </motion.div>

              <motion.p
                className="site-preloader-tagline mt-8 max-w-xl whitespace-pre-line text-sm font-black uppercase leading-7 tracking-normal sm:text-base"
                initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reducedMotion ? 0.25 : 2.95,
                  duration: reducedMotion ? 0.2 : 0.64,
                  ease: PRELOADER_EASE,
                }}
              >
                {"Desde Usme,\nCon disciplina,\nHacia el futuro."}
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
