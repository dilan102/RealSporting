"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

export function HeroScrollEffect() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId: number | null = null;
    let target = window.scrollY;
    let current = target;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const update = () => {
      current = lerp(current, target, 0.12);
      setScrollY(Math.round(current));
      rafId = requestAnimationFrame(update);
    };

    const onScroll = () => {
      target = window.scrollY;
      if (rafId == null) {
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // initialise
    target = window.scrollY;
    current = target;
    setScrollY(target);
    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };
  }, []);

  const style = useMemo(
    () => ({
      "--scroll-y": `${scrollY}px`,
    } as CSSProperties),
    [scrollY],
  );

  return (
    <div className="hero-scroll-effect" style={style} aria-hidden="true">
      <div className="hero-scroll-shape shape-1" />
      <div className="hero-scroll-shape shape-2" />
      <div className="hero-scroll-shape shape-3" />
    </div>
  );
}
