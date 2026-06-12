"use client";

import { ReactNode } from "react";

/**
 * Componente que solo renderiza su contenido cuando el preloader ha desaparecido.
 * Esto evita renderizar componentes pesados mientras se muestra el preloader.
 */
export function MainContentRenderer({ children }: { children: ReactNode }) {
  return children;
}
