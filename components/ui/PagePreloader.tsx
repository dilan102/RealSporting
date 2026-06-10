'use client';
import { useEffect, useState } from 'react';

export default function PagePreloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const hide = () => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = '';
      }, 500);
    };

    // Disparar al cargar, con un mínimo de 800ms para la animación
    const start = Date.now();
    const onLoad = () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, 800 - elapsed);
      setTimeout(hide, wait);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }

    return () => window.removeEventListener('load', onLoad);
  }, []);

  if (!visible) return null;

  return (
    <div className={`preloader-overlay ${fading ? 'fading' : ''}`}>
      <div className="preloader-box">
        {/* Render SPORTING letters */}
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
    </div>
  );
}
