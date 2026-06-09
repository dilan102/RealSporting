"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  const [chars, setChars] = useState<string[]>(() => text.split("").map((char) => (char === " " ? " " : "█")));
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const rafs = useRef<number[]>([]);
  const timeouts = useRef<number[]>([]);

  const runAnimation = useMemo(() => {
    return () => {
      if (hasStarted) return;
      setHasStarted(true);

      const letters = text.split("");
      const totalLetters = letters.filter((char) => char !== " ").length;
      const perLetter = (duration - scrambleDuration) / Math.max(totalLetters, 1);

      letters.forEach((char, index) => {
        if (char === " ") return;

        const letterDelay = delay + index * perLetter;
        const startAt = window.setTimeout(() => {
          const startTime = performance.now();

          const scramble = (start: number) => {
            const elapsed = performance.now() - start;
            if (elapsed >= scrambleDuration) {
              setChars((prev) => {
                const next = [...prev];
                next[index] = char;
                return next;
              });
              return;
            }

            setChars((prev) => {
              const next = [...prev];
              next[index] = CHARS[Math.floor(Math.random() * CHARS.length)];
              return next;
            });

            const frame = window.requestAnimationFrame(() => scramble(start));
            rafs.current.push(frame);
          };

          scramble(startTime);
        }, letterDelay);

        timeouts.current.push(startAt);
      });
    };
  }, [delay, duration, hasStarted, scrambleDuration, text]);

  useEffect(() => {
    return () => {
      rafs.current.forEach((frame) => window.cancelAnimationFrame(frame));
      rafs.current = [];
      timeouts.current.forEach((timer) => window.clearTimeout(timer));
      timeouts.current = [];
    };
  }, []);

  useEffect(() => {
    if (!triggerOnView) {
      const timer = window.setTimeout(runAnimation, delay);
      timeouts.current.push(timer);
      return () => {
        window.clearTimeout(timer);
      };
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [delay, runAnimation, triggerOnView]);

  return (
    <Tag ref={ref as never} className={className}>
      {chars.map((char, index) => (
        <span key={`${text}-${index}`} className="whitespace-pre-wrap">{char}</span>
      ))}
    </Tag>
  );
}
