"use client";
import { useEffect, useRef, useCallback } from "react";

type ScrollCallback = (scrollY: number) => void;

// Singleton: un solo listener para toda la app
const callbacks = new Set<(y: number) => void>();
let rafId: number | null = null;
let isListening = false;

function startListening() {
  if (isListening) return;
  isListening = true;

  let targetY = window.scrollY;
  let currentY = targetY;

  const onScroll = () => {
    targetY = window.scrollY;
    if (rafId !== null) return;

    const tick = () => {
      currentY += (targetY - currentY) * 0.12;
      const rounded = Math.round(currentY);

      callbacks.forEach((cb) => cb(rounded));

      if (Math.abs(targetY - currentY) > 0.5) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };
    rafId = window.requestAnimationFrame(tick);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

export function useScrollValue(callback: ScrollCallback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const stableCallback = useCallback((y: number) => {
    callbackRef.current(y);
  }, []);

  useEffect(() => {
    callbacks.add(stableCallback);
    startListening();
    return () => {
      callbacks.delete(stableCallback);
    };
  }, [stableCallback]);
}
