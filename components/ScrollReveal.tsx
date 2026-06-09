"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Inicial state - visibility starts at 0
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`;

    // Check if element is in viewport initially (e.g., Hero section)
    const isInitiallyVisible = () => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    let hasAnimated = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(el);

    // Fallback: If element is initially visible, reveal it immediately
    if (isInitiallyVisible()) {
      setTimeout(() => {
        if (!hasAnimated) {
          hasAnimated = true;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      }, delay);
    }

    // Safety timeout to ensure content is visible even if observers fail
    const safetyTimeout = setTimeout(() => {
      if (!hasAnimated && el) {
        hasAnimated = true;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        observer.disconnect();
      }
    }, 8000 + delay);

    return () => {
      clearTimeout(safetyTimeout);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
