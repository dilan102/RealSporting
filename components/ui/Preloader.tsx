'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * Preloader Component
 * A full-screen preloader with scanner animation and glitch exit effect
 * 
 * Usage:
 * 1. Import in your root layout: import Preloader from '@/components/ui/Preloader'
 * 2. Add to layout: <Preloader logoSrc="/path/to/logo.png" />
 */
interface PreloaderProps {
  /** Path to the club logo image */
  logoSrc?: string;
  /** Duration before preloader starts exiting (ms) */
  duration?: number;
  /** Optional callback when preloader finishes */
  onComplete?: () => void;
}

export default function Preloader({
  logoSrc = '/logo.png',
  duration = 8000,
  onComplete
}: PreloaderProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Add body class to hide page content
    document.body.classList.add('preloader-active');

    // Start the exit sequence after duration
    const exitTimer = setTimeout(() => {
      triggerGlitchExit(preloader, onComplete);
    }, duration);

    return () => clearTimeout(exitTimer);
  }, [duration, onComplete]);

  function triggerGlitchExit(
    preloader: HTMLElement,
    callback?: () => void
  ) {
    preloader.classList.add('glitch-out');

    // After glitch + fade animation (1500ms + 400ms = 1900ms)
    setTimeout(() => {
      preloader.style.display = 'none';
      document.body.classList.remove('preloader-active');
      document.body.classList.add('preloader-done');

      if (callback) {
        callback();
      }

      // Dispatch custom event
      const event = new CustomEvent('preloaderComplete');
      document.dispatchEvent(event);
    }, 1900);
  }

  return (
    <div id="preloader">
      {/* Scanner line container */}
      <div id="scanner-container">
        <div id="scanner-line"></div>
      </div>

      {/* Logo image */}
      {imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          id="preloader-logo"
          src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Ccircle cx=%22100%22 cy=%22100%22 r=%2280%22 fill=%22%2300FFFF%22 opacity=%220.5%22/%3E%3Ctext x=%22100%22 y=%22110%22 text-anchor=%22middle%22 font-size=%2224%22 fill=%22white%22%3ELOGO%3C/text%3E%3C/svg%3E"
          alt="Club Logo"
          className="w-24 h-24"
        />
      ) : (
        <Image
          id="preloader-logo"
          src={logoSrc}
          alt="Club Logo"
          width={96}
          height={96}
          onError={() => setImgError(true)}
          priority
        />
      )}

      {/* Club name - appears with scanner effect */}
      <div id="preloader-name">Club Deportivo Real Sporting</div>
    </div>
  );
}
