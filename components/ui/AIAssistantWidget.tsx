"use client";

import { useEffect, useRef } from "react";

export function AIAssistantWidget() {
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    // No cargar en la página raíz (preload)
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      return;
    }

    // Configurar Dealism antes de cargar el script
    (window as any).dealismConfig = {
      agentId: "38413",
      position: "bottom-right",
      primaryColor: "#4C9F38",
      greeting: "¡Hola! Soy el asistente de Real Sporting de Usme. ¿En qué puedo ayudarte?",
      hideWidget: false,
    };

    // Cargar el script de Dealism
    if (!document.querySelector('script[src*="widget.dealism.ai"]')) {
      const script = document.createElement("script");
      script.src = "https://widget.dealism.ai/v1/widget.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
}
