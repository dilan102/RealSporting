'use client';

import { useEffect, useRef } from 'react';

export function ScrollDecorator() {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      
      rafRef.current = requestAnimationFrame(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollY = window.scrollY;
        const totalScroll = documentHeight - windowHeight;
        const progress = totalScroll > 0 ? (scrollY / totalScroll) * 100 : 0;

        // Update DOM directly without state to avoid re-renders
        if (indicatorRef.current) {
          indicatorRef.current.style.transform = `scaleY(${progress / 100})`;
        }
        
        if (dotRef.current) {
          dotRef.current.style.top = `${progress}%`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Main scroll indicator line */}
      <div 
        ref={indicatorRef}
        className="scroll-progress-indicator"
        style={{ transform: 'scaleY(0)' }}
      />
      
      {/* Scroll dot indicator */}
      <div 
        ref={dotRef}
        className="scroll-progress-dot"
        style={{ top: '0%' }}
      />
      
      {/* Decorative line */}
      <div className="scroll-decorative-line" />
      
      {/* Secondary pattern lines */}
      <div className="scroll-secondary-lines" />
    </>
  );
}
