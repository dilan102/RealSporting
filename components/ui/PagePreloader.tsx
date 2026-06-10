'use client';
import { useEffect, useState } from 'react';

const PRELOADER_MIN_DURATION = 2500; // 2.5 segundos - optimizado para performance

export default function PagePreloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const startTime = Date.now();

    const hide = () => {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, PRELOADER_MIN_DURATION - elapsed);

      setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = '';
        }, 400);
      }, delay);
    };

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
    }

    return () => window.removeEventListener('load', hide);
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
