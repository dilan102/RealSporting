'use client';

import Image from 'next/image';
import { useState, type PointerEvent, useEffect } from 'react';
import { usePreloader } from '@/hooks/usePreloader';

interface PreloaderProps {
  logoSrc?: string;
  duration?: number;
}

export default function Preloader({ logoSrc = '/logo.png', duration = 5000 }: PreloaderProps) {
  const { isVisible, isExiting, prefersReducedMotion } = usePreloader({ duration });
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setPointer({ x: Number((x * 0.72).toFixed(3)), y: Number((y * 0.48).toFixed(3)) });
  };

  const handlePointerLeave = () => setPointer({ x: 0, y: 0 });

  if (!isMounted || !isVisible) {
    return null;
  }

  return (
    <div
      id="preloader"
      className={`site-preloader-root ${isExiting ? 'preloader-exiting' : ''}`}
      aria-hidden={isExiting ? 'true' : 'false'}
      role="status"
      aria-live="polite"
      onPointerMove={prefersReducedMotion ? undefined : handlePointerMove}
      onPointerLeave={prefersReducedMotion ? undefined : handlePointerLeave}
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
        <h2 className="site-preloader-welcome-text">
          {Array.from('¡bienvenidos!').map((char, i) => (
            <span key={`welcome-${i}`} className="site-preloader-welcome-text-letter" style={{ animationDelay: `${i * 30}ms` }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>
      </div>

      <div
        className="site-preloader-scene"
        style={
          prefersReducedMotion
            ? undefined
            : { transform: `translate3d(${pointer.x * 10}px, ${pointer.y * 10}px, 0)` }
        }
      >
        <div
          className="site-preloader-shield"
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
        </div>

        <div className="site-preloader-ring" />
        
        <div className="site-preloader-ball">
          <Image
            src="/balon.png"
            alt="Balón de fútbol Real Sporting"
            fill
            sizes="120px"
            className="site-preloader-ball-image"
            draggable="false"
          />
        </div>

        <div className="site-preloader-trail" />
      </div>

      <div
        className="site-preloader-copy"
        style={
          prefersReducedMotion
            ? undefined
            : { transform: `translate3d(${pointer.x * -6}px, ${pointer.y * -4}px, 0)` }
        }
      >
        <h1 className="site-preloader-title">
          {'REAL SPORTING'.split('').map((letter, index) => (
            <span key={`${letter}-${index}`} className="site-preloader-title-letter" style={{ animationDelay: `${index * 45}ms` }}>
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </h1>
        <p className="site-preloader-subtitle">
          Cargando experiencia deportiva...
        </p>
      </div>
    </div>
  );
}
