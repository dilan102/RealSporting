"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { useLoading } from "@/contexts/LoadingContext";

type LottieMetadata = {
  nm?: string;
  fr?: number;
  op?: number;
  w?: number;
  h?: number;
};

type CssVars = CSSProperties & Record<`--${string}`, string>;

function LottieJsonSignal() {
  const [metadata, setMetadata] = useState<LottieMetadata | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/Preloader.json")
      .then((response) => response.json() as Promise<LottieMetadata>)
      .then((payload) => {
        if (active) {
          setMetadata(payload);
        }
      })
      .catch(() => {
        if (active) {
          setMetadata({ nm: "Real Sporting preloader", fr: 30, op: 46, w: 1920, h: 1080 });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const duration = useMemo(() => {
    if (!metadata?.fr || !metadata?.op) {
      return "1.5s";
    }

    return `${Math.max(metadata.op / metadata.fr, 1).toFixed(2)}s`;
  }, [metadata]);

  return (
    <div
      className="lottie-json-signal"
      aria-label={metadata?.nm || "Animación de carga Real Sporting"}
      style={{ "--lottie-duration": duration } as CssVars}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <span key={index} style={{ "--delay": `${index * 0.13}s` } as CssVars} />
      ))}
    </div>
  );
}

/**
 * Preloader profesional que solo se renderiza durante la carga inicial.
 * Se desvanece suavemente cuando todos los recursos están listos.
 */
export default function PagePreloader() {
  const { isPreloaderVisible, isPreloaderFading } = useLoading();

  if (!isPreloaderVisible) return null;

  return (
    <motion.div
      className="site-preloader-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: isPreloaderFading ? 0 : 1 }}
      transition={{ duration: isPreloaderFading ? 0.62 : 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="site-preloader-panel"
        initial={{ y: 18, scale: 0.98, opacity: 0 }}
        animate={{ y: isPreloaderFading ? -16 : 0, scale: isPreloaderFading ? 0.98 : 1, opacity: isPreloaderFading ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="site-preloader-logo">
          <Image src="/logo.png" alt="" width={88} height={88} priority aria-hidden="true" />
        </span>
        <LottieJsonSignal />
        <div className="site-preloader-copy">
          <p>Club Deportivo Real Sporting</p>
          <span>Usme · formación · disciplina</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
