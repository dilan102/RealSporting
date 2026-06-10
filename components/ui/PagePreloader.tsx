'use client';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Preloader profesional que solo se renderiza durante la carga inicial.
 * Se desvanece suavemente cuando todos los recursos están listos.
 */
export default function PagePreloader() {
  const { isPreloaderVisible, isPreloaderFading } = useLoading();

  // No renderizar nada si el preloader no está visible
  if (!isPreloaderVisible) return null;

  return (
    <div
      className={`preloader-overlay ${isPreloaderFading ? 'fading' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        willChange: 'opacity',
      }}
    >
      <div
        className="preloader-box"
        style={{
          display: 'flex',
          gap: '12px',
          fontSize: '48px',
          fontWeight: 900,
          letterSpacing: '4px',
          color: '#ffffff',
        }}
      >
        {/* Render SPORTING letters con animación */}
        {'SPORTING'.split('').map((char, i) => (
          <div
            key={i}
            style={{
              animation: `letterBounce 600ms ease infinite alternate`,
              animationDelay: `${i * 60}ms`,
            }}
          >
            {char}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes letterBounce {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-12px);
            opacity: 0.6;
          }
        }

        :global(.preloader-overlay) {
          transition: opacity 500ms ease-out;
          opacity: 1;
        }

        :global(.preloader-overlay.fading) {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
