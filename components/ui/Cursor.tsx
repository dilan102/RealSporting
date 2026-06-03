'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, label[for]';
const MAIN_LERP = 0.88;
const TRAIL_LERP = 0.58;

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
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    document.body.classList.add('custom-cursor-active');

    const updateHoverState = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        setIsHovering(false);
        setIsImageHover(false);
        return;
      }

      setIsHovering(Boolean(target.closest(INTERACTIVE_SELECTOR)));
      setIsImageHover(Boolean(target.closest('img, picture, video, [data-cursor-image]')));
    };

    const handleMouseMove = (event: MouseEvent) => {
      mousePos.current = { x: event.clientX, y: event.clientY };
      setIsVisible(true);
      updateHoverState(event.target);
    };

    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const animateCursor = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * MAIN_LERP;
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * MAIN_LERP;

      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * TRAIL_LERP;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * TRAIL_LERP;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameRef.current = requestAnimationFrame(animateCursor);
    };

    animateCursor();

    return () => {
      document.body.classList.remove('custom-cursor-active');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div ref={cursorRef} className={`${styles.cursor} ${styles.cursorMain}`} />
      <div
        ref={trailRef}
        className={`${styles.cursor} ${styles.cursorTrail} ${isHovering ? styles.cursorHover : ''} ${isImageHover ? styles.cursorImageHover : ''}`}
      />
    </>
  );
}
