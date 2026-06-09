'use client';

import { useEffect, useState } from 'react';

export interface UsePreloaderOptions {
  duration?: number;
}

export function usePreloader({ duration = 5000 }: UsePreloaderOptions = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    const pendingClass = 'preloader-pending';
    const activeClass = 'preloader-active';
    const element = document.documentElement;
    const body = document.body;

    element.classList.add(pendingClass, activeClass);
    body.classList.add(activeClass);

    return () => {
      element.classList.remove(pendingClass, activeClass);
      body.classList.remove(activeClass);
    };
  }, []);

  useEffect(() => {
    let timer: number | undefined;

    const startExit = () => {
      if (timer) {
        window.clearTimeout(timer);
      }

      const visibleDelay = document.readyState === 'complete' ? 300 : duration;
      timer = window.setTimeout(() => setIsExiting(true), visibleDelay);
    };

    if (document.readyState === 'complete') {
      startExit();
      return () => {
        if (timer) window.clearTimeout(timer);
      };
    }

    const handleLoad = () => startExit();
    window.addEventListener('load', handleLoad, { once: true });
    startExit();

    return () => {
      window.removeEventListener('load', handleLoad);
      if (timer) window.clearTimeout(timer);
    };
  }, [duration]);

  useEffect(() => {
    if (!isExiting) {
      return;
    }

    const exitDuration = prefersReducedMotion ? 300 : 900;
    const timer = window.setTimeout(() => {
      setIsVisible(false);
      const doneClass = 'preloader-done';

      document.documentElement.classList.remove('preloader-pending', 'preloader-active');
      document.documentElement.classList.add(doneClass);
      document.body.classList.remove('preloader-active');
      document.body.classList.add(doneClass);
    }, exitDuration);

    return () => window.clearTimeout(timer);
  }, [isExiting, prefersReducedMotion]);

  return {
    isVisible,
    isExiting,
    prefersReducedMotion,
  };
}
