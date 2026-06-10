'use client';
import { useEffect, useState } from 'react';

/**
 * Hook que detecta si el dispositivo tiene bajo rendimiento.
 * Esto permite desactivar efectos complejos en móviles o dispositivos lentos.
 */
export function usePerformanceMode() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Detectar dispositivo móvil o tablet
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Detectar RAM insuficiente (si está disponible)
    const navAny = navigator as any;
    const hasLowRAM = (navAny.deviceMemory || 8) < 4;

    // Detectar conexión lenta
    const connection = (navigator as any).connection;
    const hasSlowConnection =
      (connection?.effectiveType === '2g' ||
        connection?.effectiveType === '3g' ||
        (connection?.downlink || 10) < 1.5) ??
      false;

    // Detectar procesador lento (cores)
    const hasSlowCPU = (navAny.hardwareConcurrency || 4) < 2;

    const lowPerformance =
      isMobile || hasLowRAM || hasSlowConnection || hasSlowCPU;

    setIsLowPerformance(lowPerformance);
  }, []);

  return isLowPerformance;
}

/**
 * Hook que devuelve el número óptimo de estrellas según el rendimiento
 */
export function useOptimalStarCount() {
  const isLowPerformance = usePerformanceMode();
  return isLowPerformance ? 20 : 80;
}
