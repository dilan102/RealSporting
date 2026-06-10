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
  color: readonly [number, number, number]; // RGB - readonly tuple
}

const STAR_COLORS = [
  [255, 255, 255],    // blanco tenue
  [0, 255, 120],      // verde neón (#00FF78)
  [0, 196, 90],       // verde medio (#00C45A)
  [180, 255, 220],    // verde casi blanco
] as const;

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
    let cachedScrollY = 0;
    const isMobile = window.matchMedia("(pointer: coarse)").matches;

    const createStars = () => {
      // Usar solo viewport, no scrollHeight
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width;
      canvas.height = height;

      // Reducir cantidad de estrellas en mobile (mitad)
      const count = isMobile
        ? Math.floor((width * height) / 18000)
        : Math.floor((width * height) / 9500);

      stars = Array.from({ length: Math.max(60, count) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.55 + 0.15,
        speed: Math.random() * 0.02 + 0.01,
        twinkle: Math.random() * 0.02 + 0.01,
        depth: Math.random() * 0.9 + 0.1,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;

      // Gradiente con colores del club
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
        
        // Usar cachedScrollY en lugar de leer window.scrollY en cada frame
        const parallax = (cachedScrollY * 0.04 * star.depth) + (mouseY - height * 0.5) * 0.003 * star.depth;
        const x = star.x + (mouseX - width * 0.5) * 0.01 * star.depth;
        const y = (star.y + parallax) % (height + 60);

        if (y < -20) {
          star.y = height + 20;
        }

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        
        // Usar color asignado (colores del club)
        const [r, g, b] = star.color;
        ctx.fillStyle = `rgba(${r},${g},${b},${glowAlpha})`;
        ctx.shadowBlur = 8 + star.size * 12;
        ctx.shadowColor = `rgba(${r},${g},${b},${glowAlpha * 0.8})`;
        
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

    const handleScroll = () => {
      cachedScrollY = window.scrollY;
    };

    window.addEventListener("resize", handleResize);
    
    // Solo agregar mousemove en desktop (no en móviles táctiles)
    if (!isMobile) {
      window.addEventListener("mousemove", handleMove, { passive: true });
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden="true" />;
}
