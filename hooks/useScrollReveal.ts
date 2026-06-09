"use client";

import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit = {},
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.15, ...options },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [options]);

  return ref;
}
