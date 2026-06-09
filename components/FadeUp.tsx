"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  once?: boolean;
}

export default function FadeUp({
  children,
  className = "",
  delay = 0,
  y = 40,
  stagger = 0,
  once = true,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger > 0 ? Array.from(el.children) : [el];

    gsap.set(targets, { opacity: 0, y });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay,
          stagger,
          ease: "power3.out",
        });
      },
    });

    return () => trigger.kill();
  }, [delay, once, stagger, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
