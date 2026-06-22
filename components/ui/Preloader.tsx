'use client';

import { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

const NINOS = '/brand/preloader-ninos.jpg';
const NINAS = '/brand/preloader-ninas.jpg';
const HERO = '/brand/hero-training.jpg';
const GALLERY_TEAM = '/brand/gallery-team.jpg';
const GALLERY_YOUTH = '/brand/gallery-youth.jpg';

const VALUES = [
  { word: 'RESPETO', bg: NINOS, tagline: 'Fundamento del juego' },
  { word: 'DISCIPLINA', bg: NINAS, tagline: 'El camino al éxito' },
  { word: 'EMPATÍA', bg: HERO, tagline: 'Unidos como equipo' },
  { word: 'PASIÓN', bg: GALLERY_TEAM, tagline: 'Corazón Real Sporting' },
  { word: 'LIDERAZGO', bg: GALLERY_YOUTH, tagline: 'Formamos campeones' },
];

const TOTAL_MS = 6000;
const SLIDE_MS = TOTAL_MS / VALUES.length;

export default function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const valueWordRef = useRef<HTMLDivElement>(null);
  const goldBarRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const bgPhotoRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add('preloader-active');

    const panel = panelRef.current;
    const valueWord = valueWordRef.current;
    const goldBar = goldBarRef.current;
    const tagline = taglineRef.current;
    const bgPhoto = bgPhotoRef.current;
    const progressFill = progressFillRef.current;
    const dotsEl = dotsRef.current;

    if (!panel || !valueWord || !goldBar || !tagline || !bgPhoto || !progressFill || !dotsEl) {
      return;
    }

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let rafId: number | null = null;
    let isTransitioning = false;

    const setTimeoutTracked = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timeouts.push(id);
      return id;
    };

    const dots = VALUES.map((_, i) => {
      const d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.id = 'dot-' + i;
      dotsEl.appendChild(d);
      return d;
    });

    function reflow(el: HTMLElement) {
      void el.offsetWidth;
    }

    function resetAnim() {
      panel!.classList.remove('expand', 'collapse');
      valueWord!.classList.remove('appear');
      goldBar!.classList.remove('appear');
      tagline!.classList.remove('appear');
      reflow(panel!);
      reflow(valueWord!);
    }

    function showSlide(idx: number) {
      const v = VALUES[idx];
      bgPhoto!.classList.remove('active');
      bgPhoto!.style.backgroundImage = `url(${v.bg})`;
      setTimeoutTracked(() => bgPhoto!.classList.add('active'), 40);

      dots.forEach((d, i) => d.classList.toggle('active', i === idx));

      valueWord!.textContent = v.word;
      tagline!.textContent = v.tagline;

      resetAnim();
      panel!.classList.add('expand');
      setTimeoutTracked(() => {
        valueWord!.classList.add('appear');
        goldBar!.classList.add('appear');
        tagline!.classList.add('appear');
      }, 200);
    }

    let current = 0;
    let startTime: number | null = null;

    function nextSlide() {
      if (isTransitioning || current >= VALUES.length - 1) return;
      isTransitioning = true;
      resetAnim();
      panel!.classList.add('collapse');
      // Cross-fade: start new slide 200ms before collapse completes (420ms - 200ms = 220ms)
      setTimeoutTracked(() => {
        current++;
        showSlide(current);
        isTransitioning = false;
      }, 220);
    }

    function finish() {
      document.dispatchEvent(new CustomEvent('preloaderComplete'));
      onComplete?.();
      document.body.classList.remove('preloader-active');
      setDone(true);
      setTimeoutTracked(() => setVisible(false), 600);
    }

    // Simple timeout-based approach for each slide
    function runSlideSequence() {
      showSlide(0);
      
      for (let i = 1; i < VALUES.length; i++) {
        setTimeoutTracked(() => {
          if (!cancelled) {
            nextSlide();
          }
        }, i * SLIDE_MS);
      }
      
      setTimeoutTracked(() => {
        if (!cancelled) {
          finish();
        }
      }, TOTAL_MS);
    }

    // Progress bar animation
    function updateProgress() {
      if (cancelled) return;
      if (!startTime) startTime = Date.now();
      const elapsed = Date.now() - startTime;
      progressFill!.style.width = Math.min(100, (elapsed / TOTAL_MS) * 100) + '%';

      if (elapsed < TOTAL_MS) {
        rafId = requestAnimationFrame(updateProgress);
      } else {
        progressFill!.style.width = '100%';
      }
    }

    runSlideSequence();
    rafId = requestAnimationFrame(updateProgress);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      if (rafId !== null) cancelAnimationFrame(rafId);
      dots.forEach((d) => d.remove());
    };
  }, []);

  if (!visible) return null;

  return (
    <div id="preloader" className={done ? 'done' : undefined}>
      <div className="bg-photo" id="bgPhoto" ref={bgPhotoRef}></div>
      <div className="bg-overlay"></div>
      <div className="vignette"></div>
      <div className="center-rule"></div>
      <div className="dots" id="dots" ref={dotsRef}></div>
      <div className="panel" id="panel" ref={panelRef}>
        <div className="value-word" id="valueWord" ref={valueWordRef}></div>
        <div className="gold-bar" id="goldBar" ref={goldBarRef}></div>
        <div className="tagline" id="tagline" ref={taglineRef}></div>
      </div>
      <div className="brand-strip">
        <img src="/logo.png" alt="RS" />
        <span>Disciplina · Trabajo · Éxito</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" id="progressFill" ref={progressFillRef}></div>
      </div>
    </div>
  );
}
