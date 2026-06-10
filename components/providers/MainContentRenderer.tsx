'use client';
import { ReactNode } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Componente que solo renderiza su contenido cuando el preloader ha desaparecido.
 * Esto evita renderizar componentes pesados mientras se muestra el preloader.
 */
export function MainContentRenderer({ children }: { children: ReactNode }) {
  const { isPreloaderVisible } = useLoading();

  // No renderizar nada mientras el preloader esté visible
  if (isPreloaderVisible) {
    return null;
  }

  return children;
}
