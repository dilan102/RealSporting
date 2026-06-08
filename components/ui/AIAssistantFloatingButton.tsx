"use client";

import { useEffect, useRef } from "react";

function AIIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

export function AIAssistantFloatingButton() {
  const isRootRef = useRef(false);

  useEffect(() => {
    // Verificar si estamos en la raíz
    isRootRef.current = typeof window !== "undefined" && window.location.pathname === "/";
  }, []);

  const handleClick = () => {
    // Intentar abrir el widget de Dealism si existe
    const dealismToggle = document.querySelector('[data-dealism-toggle]');
    if (dealismToggle) {
      (dealismToggle as HTMLElement).click();
      return;
    }

    // Alternativa: enviar mensaje
    window.postMessage(
      {
        type: "DEALISM_TOGGLE_CHAT",
      },
      "*"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="btn-green alive-lift fixed bottom-6 right-6 z-[999] inline-flex min-h-[52px] min-w-[52px] items-center justify-center gap-2 rounded-full px-3 py-3 text-sm font-black text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/50 sm:px-4 [&:has(~[data-path='/'])]:hidden"
      aria-label="Abrir asistente de IA"
      title="Pregúntale al asistente de Real Sporting"
      style={{
        display: isRootRef.current ? "none" : "inline-flex",
      }}
      suppressHydrationWarning
    >
      <AIIcon />
      <span className="max-w-[9rem] truncate text-xs sm:max-w-none sm:text-sm">
        Asistente IA
      </span>
    </button>
  );
}
