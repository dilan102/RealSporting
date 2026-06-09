'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, type PointerEvent } from 'react';
import { usePreloader } from '@/hooks/usePreloader';

interface PreloaderProps {
  logoSrc?: string;
  duration?: number;
}

const preloaderEase = [0.22, 1, 0.36, 1] as const;

const shimmer = {
  initial: { opacity: 0.15, scale: 0.96 },
  animate: {
    opacity: [0.15, 0.35, 0.15],
    scale: [0.98, 1, 0.98],
    transition: {
      duration: 3.2,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1] as const,
    },
  },
};

export default function Preloader({ logoSrc = '/logo.png', duration = 5000 }: PreloaderProps) {
  const { isVisible, isExiting, prefersReducedMotion } = usePreloader({ duration });
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setPointer({ x: Number((x * 0.72).toFixed(3)), y: Number((y * 0.48).toFixed(3)) });
  };

  const handlePointerLeave = () => setPointer({ x: 0, y: 0 });
  const titleLetters = 'REAL SPORTING'.split('');

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          id="preloader"
          className="site-preloader-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, filter: 'blur(12px)' }}
          transition={{ duration: prefersReducedMotion ? 0.35 : 0.75, ease: preloaderEase }}
          aria-hidden={isExiting ? 'true' : 'false'}
          role="status"
          aria-live="polite"
          onPointerMove={prefersReducedMotion ? undefined : handlePointerMove}
          onPointerLeave={prefersReducedMotion ? undefined : handlePointerLeave}
          style={{ perspective: 1000 }}
        >
          <div className="site-preloader-background" />
          <div className="site-preloader-grid" aria-hidden="true">
            <span className="site-preloader-dot" />
            <span className="site-preloader-dot" />
            <span className="site-preloader-dot" />
          </div>

          <div className="site-preloader-watermark" aria-hidden="true">
            <Image
              src={logoSrc}
              alt=""
              fill
              sizes="160px"
              className="site-preloader-watermark-image"
              priority
            />
          </div>

          <div className="site-preloader-welcome" aria-hidden={isExiting ? 'true' : 'false'}>
            <motion.h2
              className="site-preloader-welcome-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.28 : 0.9, ease: preloaderEase }}
            >
              {Array.from('¡bienvenidos!').map((char, i) => (
                <motion.span
                  key={`welcome-${i}-${char}`}
                  className="site-preloader-welcome-text-letter"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 1, y: [0, -6, 0], scale: [1, 1.02, 1] }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0.28, delay: 0.18 + i * 0.02 }
                      : { duration: 2.8, repeat: Infinity, ease: preloaderEase, delay: 0.22 + i * 0.04 }
                  }
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h2>
          </div>

          <div
            className="site-preloader-scene"
            style={{
              transform: prefersReducedMotion
                ? undefined
                : `translate3d(${pointer.x * 10}px, ${pointer.y * 10}px, 0)`,
            }}
          >
            <motion.div
              className="site-preloader-shield"
              initial={{ opacity: 0.18, scale: 0.98 }}
              animate={{ opacity: 0.35, scale: 1 }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              style={
                prefersReducedMotion
                  ? undefined
                  : { transform: `translate3d(${pointer.x * -6}px, ${pointer.y * -6}px, 0)` }
              }
            >
              <svg viewBox="0 0 220 260" className="site-preloader-shield-svg" role="presentation">
                <path
                  d="M110 12c36 0 65 22 65 56 0 43-22 96-55 122-14 10-27 18-35 22-8-4-21-12-35-22C67 164 45 111 45 68 45 34 74 12 110 12Z"
                  className="site-preloader-shield-path"
                />
              </svg>
            </motion.div>

            <motion.div
              className="site-preloader-ring"
              {...shimmer}
            />

            <motion.div
              className="site-preloader-ball"
              animate={prefersReducedMotion ? undefined : { rotate: [0, 360] }}
              transition={{ duration: 5.8, ease: 'linear' as const, repeat: Infinity }}
            >
              <Image
                src="/balon.png"
                alt="Balón de fútbol Real Sporting"
                fill
                sizes="120px"
                className="site-preloader-ball-image"
                draggable="false"
              />
            </motion.div>

            <motion.div
              className="site-preloader-trail"
              animate={prefersReducedMotion ? undefined : { opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: [0.42, 0, 0.58, 1] as const }}
            />
          </div>

          <div
            className="site-preloader-copy"
            style={
              prefersReducedMotion
                ? undefined
                : { transform: `translate3d(${pointer.x * -6}px, ${pointer.y * -4}px, 0)` }
            }
          >
            <motion.h1
              initial={{ opacity: 0, y: 18, letterSpacing: 6 }}
              animate={{ opacity: 1, y: 0, letterSpacing: 1.8 }}
              transition={{ duration: 0.9, ease: preloaderEase, delay: 0.35 }}
              className="site-preloader-title"
            >
              {titleLetters.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  className="site-preloader-title-letter"
                  initial={{ opacity: 0, y: 28, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.72,
                    ease: preloaderEase,
                    delay: 0.35 + index * 0.045,
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.55 }}
              className="site-preloader-subtitle"
            >
              Cargando experiencia deportiva...
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
