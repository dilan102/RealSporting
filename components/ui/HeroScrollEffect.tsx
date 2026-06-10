"use client";

import { useEffect, useRef } from "react";

export function HeroScrollEffect() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    let rafId: number | null = null;
    let target = 0;
    let current = 0;
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const onScroll = () => {
      target = window.scrollY;
      if (rafId !== null) return; // ya hay un frame en vuelo

      const tick = () => {
        current = lerp(current, target, 0.12);
        // Escribe directo al DOM — cero re-renders de React
        el.style.setProperty("--scroll-y", `${Math.round(current)}px`);

        if (Math.abs(target - current) > 0.5) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = null; // loop se detiene cuando alcanza el target
        }
      };
      rafId = requestAnimationFrame(tick);
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
