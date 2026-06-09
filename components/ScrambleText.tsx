"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
}

export default function ScrambleText({
  text,
  className,
  delay = 0,
  duration = 1100,
  tag: Tag = "span",
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text.replace(/\S/g, "_"));
  const rafRef = useRef<number | null>(null);

  const target = useMemo(() => text, [text]);

  useEffect(() => {
    const start = Date.now() + delay;
    const end = start + duration;

    const scramble = () => {
      const now = Date.now();

      if (now >= end) {
        setDisplay(target);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        return;
      }

      const progress = (now - start) / duration;
      const chars = target.split("").map((char, index) => {
        if (char === " ") return " ";
        if (progress > index / Math.max(target.length, 1) * 0.85) return char;
        return CHARSET[Math.floor(Math.random() * CHARSET.length)];
      });

      setDisplay(chars.join(""));
      rafRef.current = window.requestAnimationFrame(scramble);
    };

    setDisplay(target.replace(/\S/g, "_"));
    rafRef.current = window.requestAnimationFrame(scramble);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [delay, duration, target]);

  return <Tag className={className}>{display}</Tag>;
}
