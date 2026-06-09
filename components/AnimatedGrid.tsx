"use client";

import { useEffect, useRef } from "react";

interface Cell {
  x: number;
  y: number;
  alpha: number;
  target: number;
  speed: number;
  timeoutId?: ReturnType<typeof setTimeout>;
}

export default function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLOR_R = 59;
    const COLOR_G = 130;
    const COLOR_B = 246;
    const MAX_ALPHA = 0.13;
    const ACTIVE_RATIO = 0.025;

    const getCellSize = () => {
      const width = window.innerWidth;
      if (width < 640) return 36;
      if (width < 1024) return 44;
      return 52;
    };

    let cells: Cell[] = [];
    let raf = 0;
    let cellSize = getCellSize();
    const gap = 1;

    const build = () => {
      cellSize = getCellSize();
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight || window.innerHeight;

      cells.forEach((cell) => {
        if (cell.timeoutId) clearTimeout(cell.timeoutId);
      });

      cells = [];
      const cols = Math.ceil(canvas.width / cellSize) + 1;
      const rows = Math.ceil(canvas.height / cellSize) + 1;

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          cells.push({
            x: col * cellSize,
            y: row * cellSize,
            alpha: 0,
            target: Math.random() < ACTIVE_RATIO ? MAX_ALPHA : 0,
            speed: 0.02 + Math.random() * 0.035,
          });
        }
      }
    };

    const scheduleOff = (cell: Cell) => {
      if (cell.timeoutId) clearTimeout(cell.timeoutId);
      cell.timeoutId = setTimeout(() => {
        cell.target = 0;
        cell.timeoutId = undefined;
      }, 700 + Math.random() * 2200);
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cells.forEach((cell) => {
        const diff = cell.target - cell.alpha;
        cell.alpha += diff * cell.speed * 5;

        if (Math.abs(diff) < 0.003) {
          cell.alpha = cell.target;
        }

        if (cell.target > 0 && Math.random() < 0.004 && !cell.timeoutId) {
          scheduleOff(cell);
        }

        if (cell.alpha > 0.02) {
          ctx.fillStyle = `rgba(${COLOR_R}, ${COLOR_G}, ${COLOR_B}, ${cell.alpha})`;
          ctx.fillRect(cell.x + gap, cell.y + gap, cellSize - gap * 2, cellSize - gap * 2);
        }
      });

      raf = window.requestAnimationFrame(tick);
    };

    build();
    tick();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        window.cancelAnimationFrame(raf);
        build();
        tick();
      }, 150);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      cells.forEach((cell) => {
        if (cell.timeoutId) clearTimeout(cell.timeoutId);
      });
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full" aria-hidden="true" />;
}
