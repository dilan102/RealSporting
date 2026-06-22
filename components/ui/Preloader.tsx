'use client';

import { useEffect } from 'react';

/**
 * Preloader Component
 * A full-screen preloader with club values animation
 * 
 * Usage:
 * 1. Import in your root layout: import Preloader from '@/components/ui/Preloader'
 * 2. Add to layout: <Preloader />
 */
interface PreloaderProps {
  /** Optional callback when preloader finishes */
  onComplete?: () => void;
}

export default function Preloader({
  onComplete
}: PreloaderProps) {
  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Add body class to hide page content
    document.body.classList.add('preloader-active');

    // Listen for preloader complete event from JS
    const handleComplete = () => {
      if (onComplete) {
        onComplete();
      }
    };

    document.addEventListener('preloaderComplete', handleComplete);

    return () => {
      document.removeEventListener('preloaderComplete', handleComplete);
    };
  }, [onComplete]);

  return (
    <div id="preloader">
      <div className="bg-photo" id="bgPhoto"></div>
      <div className="bg-overlay"></div>
      <div className="vignette"></div>
      <div className="center-rule"></div>
      <div className="dots" id="dots"></div>
      <div className="panel" id="panel">
        <div className="value-word" id="valueWord"></div>
        <div className="gold-bar" id="goldBar"></div>
        <div className="tagline" id="tagline"></div>
      </div>
      <div className="brand-strip">
        <img src="/logo.png" alt="RS" />
        <span>Disciplina · Trabajo · Éxito</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" id="progressFill"></div>
      </div>
    </div>
  );
}
