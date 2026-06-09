'use client';

import { useEffect, useState } from 'react';

export interface UsePreloaderOptions {
  duration?: number;
}

export function usePreloader({ duration = 3500 }: UsePreloaderOptions = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Inicializar las clases HTML tan pronto como sea posible
  useEffect(() => {
    setIsMounted(true);
    
    const pendingClass = 'preloader-pending';
    const activeClass = 'preloader-active';
    const element = document.documentElement;
    const body = document.body;

    // Agregar clases iniciales
    element.classList.add(pendingClass, activeClass);
    body.classList.add(activeClass);

    return () => {
      element.classList.remove(pendingClass, activeClass);
      body.classList.remove(activeClass);
    };
  }, []);

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
    if (!isMounted) return;
    
    let timer: number | undefined;

    const startExit = () => {
      if (timer) {
        window.clearTimeout(timer);
      }

      // Usar la duración especificada siempre
      timer = window.setTimeout(() => {
        console.log('[Preloader] Starting exit animation');
        setIsExiting(true);
      }, duration);
    };

    // Si el documento ya está completamente cargado
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      console.log('[Preloader] Document ready state:', document.readyState);
      startExit();
      return () => {
        if (timer) window.clearTimeout(timer);
      };
    }

    // Si aún está cargando, esperar al evento load
    const handleLoad = () => {
      console.log('[Preloader] Load event fired');
      startExit();
    };

    window.addEventListener('load', handleLoad, { once: true });
    
    // También iniciar después de un corto delay como fallback
    const fallbackTimer = window.setTimeout(() => {
      console.log('[Preloader] Fallback timeout triggered');
      if (!isExiting) {
        startExit();
      }
    }, 500);

    return () => {
      window.removeEventListener('load', handleLoad);
      if (timer) window.clearTimeout(timer);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, [duration, isMounted, isExiting]);

  useEffect(() => {
    if (!isExiting || !isMounted) {
      return;
    }

    const exitDuration = prefersReducedMotion ? 300 : 900;
    const timer = window.setTimeout(() => {
      console.log('[Preloader] Completing exit, setting preloader-done');
      setIsVisible(false);
      const doneClass = 'preloader-done';

      document.documentElement.classList.remove('preloader-pending', 'preloader-active');
      document.documentElement.classList.add(doneClass);
      document.body.classList.remove('preloader-active');
      document.body.classList.add(doneClass);
    }, exitDuration);

    return () => window.clearTimeout(timer);
  }, [isExiting, prefersReducedMotion, isMounted]);

  return {
    isVisible,
    isExiting,
    prefersReducedMotion,
  };
}
