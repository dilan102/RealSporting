"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "real-sporting-theme-v2";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const isLight = theme === "light";

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    const initialTheme = storedTheme === "dark" ? "dark" : "light";

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "light" ? "dark" : "light";

      applyTheme(nextTheme);
      window.localStorage.setItem(STORAGE_KEY, nextTheme);

      return nextTheme;
    });
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative z-[60] inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-bg-elevated text-muted shadow-sm transition-colors hover:border-accent/40 hover:text-text"
      aria-label={isLight ? "Activar modo oscuro" : "Activar modo claro"}
      title={isLight ? "Modo oscuro" : "Modo claro"}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
