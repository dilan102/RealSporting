"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Cursor from "./Cursor";
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

interface MatchData {
  date: string;
  day: string;
  month: string;
  matchType: string;
  description: string;
  stadium?: string;
  time: string;
}

const matchesData: MatchData[] = [
  {
    date: "15",
    day: "15",
    month: "JUN",
    matchType: "PRETEMPORADA",
    description: "REAL SPORTING VS ALIANZA PETROLERA",
    stadium: "ESTADIO NEMESIO CAMACHO EL CAMPÍN",
    time: "3:00 PM",
  },
  {
    date: "18",
    day: "18",
    month: "JUN",
    matchType: "PRETEMPORADA",
    description: "REAL SPORTING VS ENVIGADO FC",
    stadium: "ESTADIO NEMESIO CAMACHO EL CAMPÍN",
    time: "2:00 PM",
  },
  {
    date: "22",
    day: "22",
    month: "JUN",
    matchType: "PRETEMPORADA",
    description: "REAL SPORTING VS DEPORTIVO CALI",
    stadium: "ESTADIO NEMESIO CAMACHO EL CAMPÍN",
    time: "4:00 PM",
  },
  {
    date: "25",
    day: "25",
    month: "JUN",
    matchType: "PRETEMPORADA",
    description: "REAL SPORTING VS JAGUARES DE CÓRDOBA",
    stadium: "ESTADIO NEMESIO CAMACHO EL CAMPÍN",
    time: "5:30 PM",
  },
  {
    date: "29",
    day: "29",
    month: "JUN",
    matchType: "TORNEO LOCAL",
    description: "REAL SPORTING VS MILLONARIOS",
    stadium: "ESTADIO NEMESIO CAMACHO EL CAMPÍN",
    time: "6:00 PM",
  },
  {
    date: "06",
    day: "06",
    month: "JUL",
    matchType: "TORNEO LOCAL",
    description: "REAL SPORTING VS SANTA FE",
    stadium: "ESTADIO NEMESIO CAMACHO EL CAMPÍN",
    time: "5:30 PM",
  },
  {
    date: "13",
    day: "13",
    month: "JUL",
    matchType: "TORNEO LOCAL",
    description: "REAL SPORTING VS ATLÉTICO NACIONAL",
    stadium: "ESTADIO NEMESIO CAMACHO EL CAMPÍN",
    time: "7:00 PM",
  },
  {
    date: "20",
    day: "20",
    month: "JUL",
    matchType: "TORNEO LOCAL",
    description: "REAL SPORTING VS BOYACÁ CHICÓ",
    stadium: "ESTADIO NEMESIO CAMACHO EL CAMPÍN",
    time: "4:00 PM",
  },
];

export function SitePreloader() {
  const pathname = usePathname();
  const home = isHomePath(pathname);
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [startClicked, setStartClicked] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const preloaderRef = useRef<HTMLDivElement>(null);
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

    // Solo comienza el timer si el usuario ha hecho click en "Iniciar"
    if (!startClicked) {
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("pagehide", handleBeforeUnload);
      };
    }

    const duration = reducedMotion ? 1000 : LOADER_DURATION_MS;
    const doneTimer = window.setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      window.clearTimeout(doneTimer);
    };
  }, [home, visible, reducedMotion, startClicked]);

  useEffect(() => {
    if (!home) {
      clearPreloaderScrollState();
    }
  }, [home]);

  useEffect(() => {
    if (!visible || !preloaderRef.current) return;

    let animationFrameId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Calcular la distancia del mouse desde el centro (más sensible)
        const moveX = (clientX - centerX) * 0.08;
        const moveY = (clientY - centerY) * 0.08;

        setParallax({ x: moveX, y: moveY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [visible]);

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
          style={{ willChange: "transform" }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: exitDuration, ease: PRELOADER_EASE },
          }}
          ref={preloaderRef}
        >
          <Cursor />
          
          {/* Fondo oscuro deportivo con efecto blur */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#1a3a2a] via-[#0f2818] to-[#1a3a2a] opacity-95"
            animate={{ x: parallax.x * 0.08, y: parallax.y * 0.08 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            style={{ willChange: "transform" }}
          />
          
          {/* Efecto de iluminación central que sigue al mouse */}
          <motion.div
            className="absolute pointer-events-none overflow-visible"
            animate={{ x: parallax.x * 0.35, y: parallax.y * 0.35 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            style={{
              inset: "-50%",
              background: `radial-gradient(circle 550px at 50% 50%, rgba(21, 79, 55, 0.2) 0%, rgba(21, 79, 55, 0.05) 60%, rgba(21, 79, 55, 0) 100%)`,
              willChange: "transform"
            }}
          />
          
          {/* Efecto de difuminado en círculo que sigue al mouse (viñeta) */}
          <motion.div
            className="absolute pointer-events-none overflow-visible"
            animate={{ x: parallax.x * 0.25, y: parallax.y * 0.25 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
            style={{
              inset: "-50%",
              background: `radial-gradient(circle 700px at 50% 50%, rgba(255,255,255,0) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5) 100%)`,
              willChange: "transform"
            }}
          />
          
          {/* Efectos de luz sutil con parallax */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl pointer-events-none"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              x: parallax.x * 0.12,
              y: parallax.y * 0.12,
            }}
            transition={{
              opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              x: { type: "spring", stiffness: 250, damping: 20 },
              y: { type: "spring", stiffness: 250, damping: 20 },
            }}
            style={{ willChange: "transform" }}
          />

          <motion.div
            className="absolute -left-32 top-1/3 w-96 h-96 bg-accent/2 rounded-full blur-3xl pointer-events-none"
            animate={{
              opacity: [0.1, 0.3, 0.1],
              x: -parallax.x * 0.08,
              y: -parallax.y * 0.08,
            }}
            transition={{
              opacity: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 },
              x: { type: "spring", stiffness: 250, damping: 20 },
              y: { type: "spring", stiffness: 250, damping: 20 },
            }}
            style={{ willChange: "transform" }}
          />
          
          {/* Contenido principal con parallax */}
          <motion.div
            className="relative z-10 min-h-screen flex items-center justify-center px-5 py-10"
            animate={{ x: parallax.x * 0.4, y: parallax.y * 0.4 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            style={{ willChange: "transform" }}
          >
            <div className="w-full max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Lado izquierdo - Logo y marca */}
                <motion.div
                  className="flex flex-col items-center md:items-start space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: PRELOADER_EASE }}
                >
                  {/* Logo Real Sporting */}
                  <div className="grid size-32 place-items-center rounded-full bg-white/5 backdrop-blur p-4 border border-accent/30">
                    <Image
                      src="/logo.png"
                      alt="Real Sporting"
                      width={100}
                      height={100}
                      className="object-contain"
                      priority
                      aria-hidden="true"
                    />
                  </div>
                  
                  {/* Texto marca */}
                  <div className="text-center md:text-left">
                    <p className="text-white/70 text-sm font-light">CLUB DEPORTIVO</p>
                    <p className="text-4xl font-black text-white tracking-tight">Real Sporting</p>
                  </div>
                </motion.div>

                {/* Centro - Título y descripción */}
                <motion.div
                  className="flex flex-col items-center space-y-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: PRELOADER_EASE }}
                >
                  <div className="text-center">
                    <p className="text-white/50 text-sm uppercase tracking-widest font-light">Temporada 2026</p>
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mt-2">
                      Calendario de Partidos
                    </h2>
                  </div>
                </motion.div>

                {/* Lado derecho - Cuadros de partidos */}
                <motion.div
                  className="flex flex-col space-y-3 md:max-h-[500px] md:overflow-y-auto"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: PRELOADER_EASE }}
                >
                  {matchesData.map((match, index) => (
                    <motion.div
                      key={index}
                      className="relative group cursor-pointer"
                      onHoverStart={() => setHoveredIndex(index)}
                      onHoverEnd={() => setHoveredIndex(null)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                    >
                      <motion.div
                        className="flex items-center gap-3 p-3 rounded-lg border border-accent/20 bg-white/5 backdrop-blur hover:bg-white/10 transition-colors duration-300 shadow-lg shadow-accent/10"
                        animate={
                          hoveredIndex === index
                            ? { x: [0, 5, 0] }
                            : { x: 0 }
                        }
                        transition={{
                          duration: 0.4,
                          repeat: hoveredIndex === index ? Infinity : 0,
                          repeatType: "reverse",
                        }}
                      >
                        {/* Efecto de glow al hover */}
                        <motion.div
                          className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-accent/5 to-accent/20 rounded-lg blur opacity-0 pointer-events-none -z-10"
                          animate={
                            hoveredIndex === index
                              ? { opacity: 1, scale: 1.05 }
                              : { opacity: 0, scale: 0.95 }
                          }
                          transition={{ duration: 0.3 }}
                        />
                        {/* Fecha cuadro */}
                        <motion.div
                          className="flex flex-col items-center justify-center bg-accent/30 border-2 border-accent/50 rounded-lg px-3 py-2 min-w-[60px]"
                          animate={hoveredIndex === index ? { scale: 1.1 } : { scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <span className="text-xs font-black text-accent/80">
                            {match.month}
                          </span>
                          <span className="text-lg font-black text-white">
                            {match.day}
                          </span>
                        </motion.div>

                        {/* Información del partido */}
                        <motion.div
                          className="flex-1 min-w-0"
                          animate={hoveredIndex === index ? { x: 4 } : { x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-xs font-black text-accent/70 uppercase tracking-wide">
                            {match.matchType}
                          </p>
                          <p className="text-xs md:text-sm font-black text-white uppercase truncate">
                            {match.description}
                          </p>
                          <p className="text-xs text-white/50 mt-1">
                            {match.time}
                          </p>
                        </motion.div>

                        {/* Icono de expansión */}
                        <motion.div
                          className="text-accent text-lg font-black"
                          animate={hoveredIndex === index ? { rotate: 90 } : { rotate: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          ▶
                        </motion.div>
                      </motion.div>

                      {/* Panel expandido con información adicional */}
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={
                          hoveredIndex === index
                            ? { opacity: 1, height: "auto" }
                            : { opacity: 0, height: 0 }
                        }
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className="mt-2 p-3 rounded-lg bg-accent/10 border border-accent/30 space-y-2"
                          initial={{ y: -10 }}
                          animate={hoveredIndex === index ? { y: 0 } : { y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-accent font-black">📍</span>
                            <span className="text-xs text-white/70">
                              {match.stadium}
                            </span>
                          </div>
                          <motion.div
                            className="flex items-center gap-2 pt-2 border-t border-accent/20"
                            initial={{ opacity: 0 }}
                            animate={
                              hoveredIndex === index ? { opacity: 1 } : { opacity: 0 }
                            }
                            transition={{ delay: 0.15, duration: 0.3 }}
                          >
                            <span className="text-accent font-black">⏰</span>
                            <span className="text-xs text-white/70">
                              Horario: {match.time}
                            </span>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Botón Iniciar */}
              <motion.div
                className="flex justify-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <motion.button
                  onClick={() => setStartClicked(true)}
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.92 }}
                  className="relative overflow-hidden rounded-full bg-accent px-12 py-4 font-black uppercase tracking-wider text-white transition-all duration-300 hover:shadow-2xl hover:shadow-accent/60 disabled:opacity-50 text-lg"
                  disabled={startClicked}
                >
                  {/* Efecto difuminado de fondo */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                    animate={
                      startClicked ? { x: ["-100%", "100%"] } : { opacity: 0 }
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />

                  {/* Contenido del botón */}
                  <span className="relative z-10">
                    {startClicked ? "Cargando..." : "Iniciar"}
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
