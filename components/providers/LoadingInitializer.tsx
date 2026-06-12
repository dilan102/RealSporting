'use client';
import { useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Componente que inicializa y coordina la carga de recursos críticos.
 * Se ejecuta apenas el DOM está listo y monitoriza:
 * - Fuentes del documento
 * - Imágenes críticas
 * - Componentes críticos (Hero)
 */
export function LoadingInitializer() {
  const { markFontsReady, markCriticalImagesReady } = useLoading();

  useEffect(() => {
    // 1. Esperar a que las fuentes estén listas
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        markFontsReady();
      });
    } else {
      // Fallback para navegadores sin soporte FontFaceSet
      markFontsReady();
    }
  }, [markFontsReady]);

  useEffect(() => {
    // 2. Esperar a que las imágenes críticas (especialmente Hero) estén cargadas
    const checkCriticalImages = () => {
      // Buscar la imagen del Hero
      const heroImage = document.querySelector('[data-critical-image="hero-image"] img, img[data-critical-image="hero-image"]') as HTMLImageElement | null;
      
      if (!heroImage) {
        // Si no hay imagen crítica, marcar como lista inmediatamente
        markCriticalImagesReady();
        return;
      }

      if (heroImage.complete && heroImage.naturalHeight > 0) {
        // Ya está cargada
        markCriticalImagesReady();
      } else {
        // Esperar a que cargue
        heroImage.addEventListener('load', () => markCriticalImagesReady(), { once: true });
        heroImage.addEventListener('error', () => markCriticalImagesReady(), { once: true });
      }
    };

    // Dar un pequeño delay para asegurar que el DOM está completamente renderizado
    const timer = setTimeout(() => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkCriticalImages, { once: true });
      } else {
        checkCriticalImages();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [markCriticalImagesReady]);

  return null;
}
