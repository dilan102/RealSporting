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
      }, 400);
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
