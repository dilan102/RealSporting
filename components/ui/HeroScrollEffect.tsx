"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

export function HeroScrollEffect() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    const updateScroll = () => {
      setScrollY(window.scrollY);
      frame = 0;
    };

    const onScroll = () => {
      if (frame) {
        return;
      }
      frame = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  const style = useMemo(
    () =>
      ({
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
