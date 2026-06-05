"use client";

import { useTheme } from "next-themes";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function DayNightScrollIndicator() {
  const { setTheme } = useTheme();
  const [progress, setProgress] = useState(0);
  const activeTheme = useRef<"dark" | "light" | null>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-scroll-theme", "active");

    const update = () => {
      const scrollable = Math.max(root.scrollHeight - window.innerHeight, 1);
      const transitionDistance = Math.max(Math.min(scrollable, window.innerHeight * 2.2), 520);
      const nextProgress = clamp(window.scrollY / transitionDistance);
      const roundedProgress = Number(nextProgress.toFixed(3));
      const nextTheme = nextProgress > 0.55 ? "light" : "dark";

      root.style.setProperty("--scroll-day-progress", String(roundedProgress));
      setProgress(roundedProgress);

      if (activeTheme.current !== nextTheme) {
        activeTheme.current = nextTheme;
        setTheme(nextTheme);
      }
    };

    const scheduleUpdate = () => {
      if (frame.current !== null) {
        return;
      }

      frame.current = window.requestAnimationFrame(() => {
        frame.current = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [setTheme]);

  return (
    <div
      className="day-night-indicator"
      style={{ "--day-progress": progress } as CSSProperties}
      aria-hidden="true"
    >
      <span className="day-night-sun" />
      <span className="day-night-moon">
        <span />
        <span />
        <span />
      </span>
      <span className="day-night-stars">
        {Array.from({ length: 7 }).map((_, index) => (
          <span key={index} />
        ))}
      </span>
      <span className="day-night-water" />
    </div>
  );
}
