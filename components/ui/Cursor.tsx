'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isImageHover, setIsImageHover] = useState(false);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Solo activar en dispositivos no táctiles
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    // Agregar clase al body para ocultar cursor nativo
    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleLinkHover = () => setIsHovering(true);
    const handleLinkLeave = () => setIsHovering(false);

    const handleImageHover = () => setIsImageHover(true);
    const handleImageLeave = () => setIsImageHover(false);

    // Agregar event listeners para movimiento del mouse
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Detectar hover en elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleLinkHover);
      el.addEventListener('mouseleave', handleLinkLeave);
    });

    // Detectar hover en imágenes
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('mouseenter', handleImageHover);
      img.addEventListener('mouseleave', handleImageLeave);
    });

    // Observador para detectar nuevos elementos
    const observer = new MutationObserver(() => {
      const newInteractiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
      newInteractiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleLinkHover);
        el.addEventListener('mouseleave', handleLinkLeave);
      });

      const newImages = document.querySelectorAll('img');
      newImages.forEach(img => {
        img.addEventListener('mouseenter', handleImageHover);
        img.addEventListener('mouseleave', handleImageLeave);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Animación del cursor con requestAnimationFrame
    const animateCursor = () => {
      // Interpolación suave (lerp) para el cursor principal
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;

      // Interpolación más lenta para el trail (efecto de flotación)
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.08;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.08;

      // Aplicar posiciones
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
      }

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0)`;
      }

      animationFrameRef.current = requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Cleanup
    return () => {
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleLinkHover);
        el.removeEventListener('mouseleave', handleLinkLeave);
      });

      images.forEach(img => {
        img.removeEventListener('mouseenter', handleImageHover);
        img.removeEventListener('mouseleave', handleImageLeave);
      });

      observer.disconnect();
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Si no es visible o es dispositivo táctil, no renderizar
  if (!isVisible) return null;

  return (
    <>
      {/* Cursor principal - círculo pequeño */}
      <div
        ref={cursorRef}
        className={`${styles.cursor} ${styles.cursorMain}`}
        style={{
          transform: `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`,
        }}
      />

      {/* Cursor secundario (trail) - círculo más grande con borde */}
      <div
        ref={trailRef}
        className={`${styles.cursor} ${styles.cursorTrail} ${isHovering ? styles.cursorHover : ''} ${isImageHover ? styles.cursorImageHover : ''}`}
        style={{
          transform: `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0)`,
        }}
      />
    </>
  );
}
