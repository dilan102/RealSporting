"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

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
  const shouldShowInitialPreloader = () =>
    typeof window === "undefined" ||
    window.sessionStorage.getItem("cdrs-preloader-seen") !== "true";

  const [isLoading, setIsLoading] = useState(shouldShowInitialPreloader);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(shouldShowInitialPreloader);
  const [isPreloaderFading, setIsPreloaderFading] = useState(false);
  
  const [fontsReady, setFontsReady] = useState(false);
  const [criticalImagesReady, setCriticalImagesReady] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  
  const allResourcesReady = fontsReady && criticalImagesReady && heroReady;

  const markFontsReady = useCallback(() => {
    setFontsReady(true);
  }, []);

  const markCriticalImagesReady = useCallback(() => {
    setCriticalImagesReady(true);
  }, []);

  const markHeroReady = useCallback(() => {
    setHeroReady(true);
  }, []);

  useEffect(() => {
    const alreadySeen = window.sessionStorage.getItem("cdrs-preloader-seen") === "true";

    setFontsReady(false);
    setCriticalImagesReady(false);
    setHeroReady(false);

    if (alreadySeen) {
      setIsLoading(false);
      setIsPreloaderVisible(false);
      return;
    }

    setIsLoading(true);
    setIsPreloaderVisible(true);
    document.documentElement.classList.add("preloader-active");
  }, []);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    if (allResourcesReady) {
      const timer = window.setTimeout(() => {
        setIsPreloaderFading(true);
        window.setTimeout(() => {
          setIsPreloaderVisible(false);
          setIsLoading(false);
          window.sessionStorage.setItem("cdrs-preloader-seen", "true");
          document.documentElement.classList.remove("preloader-active");
          document.documentElement.classList.add("preloader-done");
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }, 640);
      }, 420);
      return () => clearTimeout(timer);
    }
  }, [allResourcesReady, isLoading]);

  useEffect(() => {
    if (isPreloaderVisible) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.classList.add("preloader-active");
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.classList.remove("preloader-active");
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
