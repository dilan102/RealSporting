'use client';
import { useEffect } from 'react';

export function useSmoothScroll() {
  useEffect(() => {
    // Check if device is touch-enabled (mobile)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return; // Skip smooth scroll on mobile
    }

    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let rafId: number;
    const ease = 0.08; // Smoothness factor

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetY = Math.max(
        0,
        Math.min(
          document.body.scrollHeight - window.innerHeight,
          targetY + e.deltaY * 0.8
        )
      );
    };

    const animate = () => {
      currentY += (targetY - currentY) * ease;
      if (Math.abs(targetY - currentY) > 0.5) {
        window.scrollTo(0, currentY);
        rafId = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('wheel', () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(animate);
    });

    return () => {
      window.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafId);
    };
  }, []);
}
