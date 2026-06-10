'use client';

import { useEffect, useState } from 'react';

export function ScrollDecorator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;
      const totalScroll = documentHeight - windowHeight;
      const progress = totalScroll > 0 ? (scrollY / totalScroll) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main scroll indicator line */}
      <div 
        className="scroll-progress-indicator"
        style={{
          scaleY: scrollProgress / 100,
        }}
      />
      
      {/* Scroll dot indicator */}
      <div 
        className="scroll-progress-dot"
        style={{
          top: `${scrollProgress}%`,
          transition: scrollProgress === 0 || scrollProgress === 100 ? 'none' : 'top 0.1s ease-out',
        }}
      />
      
      {/* Decorative line */}
      <div className="scroll-decorative-line" />
      
      {/* Secondary pattern lines */}
      <div className="scroll-secondary-lines" />
    </>
  );
}
