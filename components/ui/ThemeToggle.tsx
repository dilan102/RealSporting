"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted ? resolvedTheme !== "dark" : true;

  function toggleTheme() {
    setTheme(isLight ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative z-[60] inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-bg-elevated text-muted shadow-sm transition-all hover:border-accent/40 hover:text-text"
      aria-label={isLight ? "Activar modo oscuro" : "Activar modo claro"}
      title={isLight ? "Modo oscuro" : "Modo claro"}
    >
      <span
        className={`absolute transition-all duration-300 ${
          isLight ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
        }`}
      >
        <Moon size={18} aria-hidden="true" />
      </span>
      <span
        className={`absolute transition-all duration-300 ${
          isLight ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <Sun size={18} aria-hidden="true" />
      </span>
    </button>
  );
}
