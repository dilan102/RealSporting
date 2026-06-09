"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  twinkle: number;
  depth: number;
}

export default function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;

    const createStars = () => {
      const width = window.innerWidth;
      const height = document.documentElement.scrollHeight || window.innerHeight;
      const count = Math.max(120, Math.floor((width * height) / 9500));

      canvas.width = width;
      canvas.height = height;

      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.55 + 0.15,
        speed: Math.random() * 0.02 + 0.01,
        twinkle: Math.random() * 0.02 + 0.01,
        depth: Math.random() * 0.9 + 0.1,
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scrollY = window.scrollY || 0;
      const width = canvas.width;
      const height = canvas.height;

      const gradient = ctx.createRadialGradient(width * 0.5, height * 0.18, 0, width * 0.5, height * 0.18, width * 0.9);
      gradient.addColorStop(0, "rgba(16, 24, 39, 0.28)");
      gradient.addColorStop(0.45, "rgba(7, 9, 14, 0.18)");
      gradient.addColorStop(1, "rgba(3, 5, 8, 0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        const drift = Math.sin(time * star.twinkle + star.x * 0.01) * 0.25;
        const pulse = 0.65 + Math.abs(drift) * 0.45;
        const glowAlpha = Math.min(1, star.alpha * pulse * (0.8 + star.depth * 0.4));
        const parallax = (scrollY * 0.04 * star.depth) + (mouseY - height * 0.5) * 0.003 * star.depth;
        const x = star.x + (mouseX - width * 0.5) * 0.01 * star.depth;
        const y = (star.y + parallax) % (height + 60);

        if (y < -20) {
          star.y = height + 20;
        }

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = `rgba(180, 210, 255, ${glowAlpha})`;
        ctx.shadowBlur = 8 + star.size * 12;
        ctx.shadowColor = `rgba(96, 165, 250, ${glowAlpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size + drift * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      raf = window.requestAnimationFrame(draw);
    };

    createStars();
    draw(0);

    const handleResize = () => {
      window.cancelAnimationFrame(raf);
      createStars();
      draw(0);
    };

    const handleMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden="true" />;
}
