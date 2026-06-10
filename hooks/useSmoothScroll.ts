'use client';
import { useEffect } from 'react';

export function useSmoothScroll() {
  useEffect(() => {
    // Smooth scroll is now handled by CSS scroll-behavior: smooth
    // This hook is kept for backwards compatibility but does nothing
    // as native CSS smooth scroll is more efficient and doesn't cause jank
    return undefined;
  }, []);
}
