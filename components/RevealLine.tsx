"use client";

import { useEffect, useRef } from "react";

interface RevealLineProps {
  label?: string;
  className?: string;
}

export default function RevealLine({ label, className = "" }: RevealLineProps) {
  const lineRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;

    el.style.transform = "scaleX(0)";
    el.style.transformOrigin = "left";
    el.style.transition = "transform 0.9s cubic-bezier(0.22,1,0.36,1)";

    if (textRef.current) {
      textRef.current.style.opacity = "0";
      textRef.current.style.transition = "opacity 0.4s ease 0.6s";
    }

    let hasAnimated = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          el.style.transform = "scaleX(1)";
          if (textRef.current) textRef.current.style.opacity = "1";
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(el);

    // Safety timeout to ensure animation runs
    const safetyTimeout = setTimeout(() => {
      if (!hasAnimated) {
        hasAnimated = true;
        el.style.transform = "scaleX(1)";
        if (textRef.current) textRef.current.style.opacity = "1";
        observer.disconnect();
      }
    }, 6000);

    return () => {
      clearTimeout(safetyTimeout);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`section-shell py-4 sm:py-6 ${className}`}>
      <div className="flex items-center gap-3">
        <div ref={lineRef} className="h-px flex-1 bg-gradient-to-r from-sky-400/70 via-white/15 to-transparent" />
        {label ? <span ref={textRef} className="section-label">{label}</span> : null}
      </div>
    </div>
  );
}
