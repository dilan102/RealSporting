"use client";

import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";

// Easing cinematic profesional
const PRELOADER_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Preloader profesional con animación Lottie integrada.
 * Características:
 * - Entrada suave (fade in + scale up)
 * - Salida suave (fade out + scale down + slide up)
 * - Transición elegante sin bloqueos visuales
 * - Compatible con móviles
 * - Aparece solo en la primera carga
 */
export default function PagePreloader() {
  const { isPreloaderVisible, isPreloaderFading } = useLoading();
  const [lottieData, setLottieData] = useState<Record<string, unknown> | null>(null);
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);

  // Cargar animación Lottie
  useEffect(() => {
    let active = true;

    const loadLottie = async () => {
      try {
        const response = await fetch("/Preloader.json");
        const data = await response.json();
        if (active) {
          setLottieData(data);
          setIsLottieLoaded(true);
        }
      } catch {
        // Fallback: si falla, mostrar preloader sin Lottie
        if (active) {
          setIsLottieLoaded(true);
        }
      }
    };

    loadLottie();
    return () => {
      active = false;
    };
  }, []);

  if (!isPreloaderVisible) return null;

  return (
    <AnimatePresence mode="wait">
      {isPreloaderVisible && (
        <motion.div
          key="preloader-root"
          className="site-preloader-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: PRELOADER_EASE,
          }}
        >
          <motion.div
            className="site-preloader-panel"
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            animate={{
              opacity: isPreloaderFading ? 0 : 1,
              y: isPreloaderFading ? -30 : 0,
              scale: isPreloaderFading ? 0.9 : 1,
            }}
            transition={{
              duration: isPreloaderFading ? 0.6 : 0.7,
              ease: PRELOADER_EASE,
              delay: isPreloaderFading ? 0 : 0.15,
            }}
          >
            {/* Logo con entrada elegante */}
            <motion.div
              className="site-preloader-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                ease: PRELOADER_EASE,
                delay: 0.1,
              }}
            >
              <Image
                src="/logo.png"
                alt=""
                width={88}
                height={88}
                priority
                aria-hidden="true"
                className="will-change-transform"
              />
            </motion.div>

            {/* Animación Lottie con fallback */}
            <motion.div
              className="site-preloader-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: PRELOADER_EASE,
                delay: 0.25,
              }}
            >
              {lottieData && isLottieLoaded ? (
                <Lottie
                  animationData={lottieData}
                  loop={true}
                  autoplay={true}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "200px",
                    margin: "0 auto",
                  }}
                  aria-label="Animación de carga"
                />
              ) : (
                // Fallback: indicador de carga minimalista
                <div className="preloader-spinner">
                  <motion.div
                    className="spinner-dot"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              )}
            </motion.div>

            {/* Texto con entrada en cascada */}
            <motion.div
              className="site-preloader-copy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: PRELOADER_EASE,
                delay: 0.4,
              }}
            >
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: PRELOADER_EASE,
                  delay: 0.5,
                }}
              >
                Club Deportivo Real Sporting
              </motion.p>
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: PRELOADER_EASE,
                  delay: 0.65,
                }}
              >
                Usme · formación · disciplina
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
