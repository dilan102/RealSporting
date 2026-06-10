"use client";

import { useEffect, useRef } from "react";

export function HeroScrollEffect() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        el.style.setProperty("--scroll-y", `${window.scrollY}px`);
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={ref} className="hero-scroll-effect" aria-hidden="true">
      <div className="hero-scroll-shape shape-1" />
      <div className="hero-scroll-shape shape-2" />
      <div className="hero-scroll-shape shape-3" />
    </div>
  );
}
