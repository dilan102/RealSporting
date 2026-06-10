'use client';
import { useLoading } from '@/contexts/LoadingContext';
import { useOptimalStarCount } from '@/hooks/usePerformance';

/**
 * StarField renderizado solo después de que el preloader desaparece.
 * Usa CSS puro para máximo rendimiento.
 * Adapta el número de estrellas según el rendimiento del dispositivo.
 */
export default function StarField() {
  const { isPreloaderVisible } = useLoading();
  const starCount = useOptimalStarCount();

  // No renderizar mientras el preloader esté visible
  if (isPreloaderVisible) {
    return null;
  }

  // Generar estrellas con posiciones aleatorias
  const stars = Array.from({ length: starCount }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 20,
    duration: 3 + Math.random() * 7,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.3,
  }));

  return (
    <>
      <div className="starfield-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="starfield-star"
            style={{
              '--top': `${star.top}%`,
              '--left': `${star.left}%`,
              '--delay': `${star.delay}s`,
              '--duration': `${star.duration}s`,
              '--size': `${star.size}px`,
              '--opacity': star.opacity,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <style jsx>{`
        .starfield-container {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 1;
          will-change: opacity;
        }

        .starfield-star {
          position: fixed;
          top: var(--top);
          left: var(--left);
          width: var(--size);
          height: var(--size);
          background: radial-gradient(circle, #ffffff, rgba(255, 255, 255, 0));
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          opacity: var(--opacity);
          animation: twinkle var(--duration) infinite ease-in-out;
          animation-delay: var(--delay);
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: var(--opacity);
          }
          50% {
            opacity: calc(var(--opacity) * 0.3);
          }
        }

        /* Desabilitar starfield en móviles para mejor rendimiento */
        @media (max-width: 768px) {
          .starfield-container {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
