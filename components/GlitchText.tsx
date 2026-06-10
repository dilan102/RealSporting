"use client";

import { useEffect, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#_-+=<>";

interface GlitchTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  className?: string;
  delay?: number;
  duration?: number;
  scrambleDuration?: number;
  triggerOnView?: boolean;
}

export default function GlitchText({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  duration = 1600,
  scrambleDuration = 350,
  triggerOnView = true,
}: GlitchTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const started = useRef(false);

  // Render inicial estático — sin estado
  const letters = text.split("");

  useEffect(() => {
    // Reducir motion: mostrar texto inmediatamente
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const el = ref.current;
      if (!el) return;
      const spans = Array.from(el.querySelectorAll("[data-char]"));
      spans.forEach((span, i) => {
        (span as HTMLElement).textContent = letters[i] ?? "";
      });
      return;
    }

    const el = ref.current;
    if (!el || started.current) return;

    // Obtener referencias directas a los spans del DOM
    const spans = Array.from(el.querySelectorAll("[data-char]")) as HTMLElement[];

    const runAnimation = () => {
      started.current = true;

      const nonSpace = letters.filter((c) => c !== " ").length;
      const perLetter = (duration - scrambleDuration) / Math.max(nonSpace, 1);
      const rafs: number[] = [];
      const timers: number[] = [];

      letters.forEach((char, i) => {
        if (char === " ") return;
        const span = spans[i];
        if (!span) return;

        const timer = window.setTimeout(() => {
          const start = performance.now();

          const scramble = () => {
            const elapsed = performance.now() - start;
            if (elapsed >= scrambleDuration) {
              span.textContent = char; // restaurar carácter final
              return;
            }
            // Escribir directo al DOM — cero renders de React
            span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
            rafs.push(requestAnimationFrame(scramble));
          };

          rafs.push(requestAnimationFrame(scramble));
        }, delay + i * perLetter);

        timers.push(timer);
      });

      return () => {
        rafs.forEach(cancelAnimationFrame);
        timers.forEach(clearTimeout);
      };
    };

    if (!triggerOnView) {
      const cleanup = runAnimation();
      return cleanup;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, duration, letters, scrambleDuration, text, triggerOnView]);

  return (
    <Tag ref={ref as never} className={className}>
      {letters.map((char, i) => (
        <span key={`${text}-${i}`} data-char>
          {char === " " ? " " : "█"}
        </span>
      ))}
    </Tag>
  );
}
