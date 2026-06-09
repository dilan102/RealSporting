"use client";

import { useEffect, useRef } from "react";

interface Cell {
  x: number;
  y: number;
  alpha: number;
  targetAlpha: number;
  speed: number;
}

export default function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL_SIZE = 42;
    const CELL_GAP = 1;
    const MAX_ALPHA = 0.18;
    const GLOW_COLOR = "45, 114, 180";
    const ACTIVE_RATIO = 0.03;

    let cells: Cell[] = [];
    let frameId = 0;

    const initialize = () => {
      const width = window.innerWidth;
      const height = document.documentElement.scrollHeight || window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      const cols = Math.ceil(width / CELL_SIZE) + 1;
      const rows = Math.ceil(height / CELL_SIZE) + 1;
      cells = [];

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          cells.push({
            x: x * CELL_SIZE,
            y: y * CELL_SIZE,
            alpha: 0,
            targetAlpha: Math.random() < ACTIVE_RATIO ? MAX_ALPHA : 0,
            speed: 0.02 + Math.random() * 0.035,
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cells.forEach((cell) => {
        cell.alpha += (cell.targetAlpha - cell.alpha) * cell.speed;

        if (Math.abs(cell.alpha - cell.targetAlpha) < 0.005) {
          cell.alpha = cell.targetAlpha;
          if (cell.targetAlpha > 0 && Math.random() < 0.005) {
            setTimeout(() => {
              cell.targetAlpha = 0;
            }, 700 + Math.random() * 1200);
          }
          if (cell.targetAlpha === 0 && Math.random() < 0.004) {
            setTimeout(() => {
              cell.targetAlpha = MAX_ALPHA * (0.35 + Math.random() * 0.75);
            }, 200 + Math.random() * 900);
          }
        }

        if (cell.alpha > 0.01) {
          ctx.fillStyle = `rgba(${GLOW_COLOR}, ${cell.alpha})`;
          ctx.fillRect(
            cell.x + CELL_GAP,
            cell.y + CELL_GAP,
            CELL_SIZE - CELL_GAP * 2,
            CELL_SIZE - CELL_GAP * 2,
          );
        }
      });

      frameId = window.requestAnimationFrame(animate);
    };

    initialize();
    animate();

    const onResize = () => {
      window.cancelAnimationFrame(frameId);
      initialize();
      animate();
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
