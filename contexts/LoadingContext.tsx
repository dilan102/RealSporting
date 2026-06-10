'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  isPreloaderVisible: boolean;
  isPreloaderFading: boolean;
  setIsPreloaderFading: (fading: boolean) => void;
  markFontsReady: () => void;
  markCriticalImagesReady: () => void;
  markHeroReady: () => void;
  allResourcesReady: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [isPreloaderFading, setIsPreloaderFading] = useState(false);
  
  const [fontsReady, setFontsReady] = useState(false);
  const [criticalImagesReady, setCriticalImagesReady] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  
  // Calcular si todos los recursos están listos
  const allResourcesReady = fontsReady && criticalImagesReady && heroReady;

  // Marcar fuentes como listas
  const markFontsReady = useCallback(() => {
    setFontsReady(true);
  }, []);

  // Marcar imágenes críticas como listas
  const markCriticalImagesReady = useCallback(() => {
    setCriticalImagesReady(true);
  }, []);

  // Marcar Hero como listo
  const markHeroReady = useCallback(() => {
    setHeroReady(true);
  }, []);

  // Efecto para manejar cuando todos los recursos están listos
  useEffect(() => {
    if (allResourcesReady && isLoading) {
      // Esperar un poco más para asegurar que todo está renderizado
      const timer = setTimeout(() => {
        setIsPreloaderFading(true);
        // Esperar a que termine la animación de fade
        setTimeout(() => {
          setIsPreloaderVisible(false);
          setIsLoading(false);
          // Restaurar scroll
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }, 500);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [allResourcesReady, isLoading]);

  // Bloquear scroll mientras el preloader esté visible
  useEffect(() => {
    if (isPreloaderVisible) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isPreloaderVisible]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        isPreloaderVisible,
        isPreloaderFading,
        setIsPreloaderFading,
        markFontsReady,
        markCriticalImagesReady,
        markHeroReady,
        allResourcesReady,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}
