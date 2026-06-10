'use client';
import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  color: string;
}

const STAR_COLORS = [
  'rgba(255,255,255,',
  'rgba(0,255,120,',
  'rgba(0,196,90,',
  'rgba(180,255,220,',
];

const STAR_COUNT = 180;

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let stars: Star[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(),
        size: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.6 + 0.15,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.08,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.x += star.vx * (0.5 + star.z * 0.5);
        star.y += star.vy * (0.5 + star.z * 0.5);

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        const glowSize = star.size * (1 + star.z * 2);
        if (star.z > 0.6) {
          const grd = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, glowSize * 3
          );
          grd.addColorStop(0, `${star.color}${star.opacity})`);
          grd.addColorStop(1, `${star.color}0)`);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowSize * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * (0.5 + star.z * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${star.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    resize();
    initStars();
    draw();

    const handleResize = () => {
      resize();
      initStars();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-screen pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
