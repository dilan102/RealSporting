'use client';
import { useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Hook que marca el Hero como listo cuando está montado.
 * Se debe usar en el componente Hero.
 */
export function useHeroReady() {
  const { markHeroReady } = useLoading();

  useEffect(() => {
    // Dar un pequeño delay para asegurar que el Hero está completamente renderizado
    const timer = setTimeout(() => {
      markHeroReady();
    }, 100);

    return () => clearTimeout(timer);
  }, [markHeroReady]);
}

/**
 * Hook para saber si la aplicación está cargando
 */
export function useIsLoading() {
  const { isLoading } = useLoading();
  return isLoading;
}

/**
 * Hook para monitorizar una imagen crítica
 */
export function useCriticalImage(imageId: string) {
  const { markCriticalImagesReady } = useLoading();

  useEffect(() => {
    const img = document.querySelector(`[data-critical-image="${imageId}"]`) as HTMLImageElement;

    if (!img) {
      return;
    }

    if (img.complete && img.naturalHeight > 0) {
      markCriticalImagesReady();
    } else {
      const handleLoad = () => markCriticalImagesReady();
      const handleError = () => markCriticalImagesReady(); // Marcar como lista incluso si hay error
      
      img.addEventListener('load', handleLoad, { once: true });
      img.addEventListener('error', handleError, { once: true });

      return () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
      };
    }
  }, [imageId, markCriticalImagesReady]);
}
