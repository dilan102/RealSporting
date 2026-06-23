'use client';

import { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

interface SlideData {
  word: string;
  bg: string;
  tagline: string;
}

const NINOS = '/brand/preloader-ninos.jpg';
const NINAS = '/brand/preloader-ninas.jpg';
const HERO = '/brand/hero-training.jpg';
const GALLERY_TEAM = '/brand/gallery-team.jpg';
const GALLERY_YOUTH = '/brand/gallery-youth.jpg';

const VALUES: SlideData[] = [
  { word: 'RESPETO', bg: NINOS, tagline: 'Fundamento del juego' },
  { word: 'DISCIPLINA', bg: NINAS, tagline: 'El camino al éxito' },
  { word: 'EMPATÍA', bg: HERO, tagline: 'Unidos como equipo' },
  { word: 'PASIÓN', bg: GALLERY_TEAM, tagline: 'Corazón Real Sporting' },
  { word: 'LIDERAZGO', bg: GALLERY_YOUTH, tagline: 'Formamos campeones' },
];

// Timing configuration
const SLIDE_VISIBLE_MS = 1000; // Time slide stays visible
const SLIDE_TRANSITION_MS = 500; // Time for horizontal drag transition
const SLIDE_TOTAL_MS = SLIDE_VISIBLE_MS + SLIDE_TRANSITION_MS;
const TOTAL_MS = SLIDE_TOTAL_MS * VALUES.length;

// Internal slide component
interface PreloaderSlideProps {
  slide: SlideData;
  state: 'active' | 'enter' | 'exit';
  index: number;
}

function PreloaderSlide({ slide, state, index }: PreloaderSlideProps) {
  const stateClass = `preloader-slide--${state}`;
  
  return (
    <div className={`preloader-slide ${stateClass}`} data-index={index}>
      <div 
        className="preloader-slide-bg"
        style={{ backgroundImage: `url(${slide.bg})` }}
      />
      <div className="preloader-slide-content">
        <div className="preloader-slide-word">{slide.word}</div>
        <div className="preloader-slide-bar" />
        <div className="preloader-slide-tagline">{slide.tagline}</div>
      </div>
    </div>
  );
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const isTransitioningRef = useRef(false);
  const currentIndexRef = useRef(0);

  const progressFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add('preloader-active');

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let rafId: number | null = null;
    let startTime: number | null = null;

    const setTimeoutTracked = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timeouts.push(id);
      return id;
    };

    const updateDots = (activeIdx: number) => {
      const dots = document.querySelectorAll('.dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIdx);
      });
    };

    const startTransition = (nextIndex: number) => {
      if (isTransitioningRef.current || cancelled) return;
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      setIncomingIndex(nextIndex);
      updateDots(nextIndex);

      // After transition completes, make the incoming slide the new active
      setTimeoutTracked(() => {
        if (!cancelled) {
          setActiveIndex(nextIndex);
          setIncomingIndex(null);
          setIsTransitioning(false);
          isTransitioningRef.current = false;
          currentIndexRef.current = nextIndex;
        }
      }, SLIDE_TRANSITION_MS);
    };

    const finish = () => {
      document.dispatchEvent(new CustomEvent('preloaderComplete'));
      onComplete?.();
      document.body.classList.remove('preloader-active');
      setDone(true);
      setTimeoutTracked(() => setVisible(false), 600);
    };

    const runSlideSequence = () => {
      // Initial slide
      updateDots(0);
      
      // Schedule transitions for remaining slides
      for (let i = 1; i < VALUES.length; i++) {
        setTimeoutTracked(() => {
          if (!cancelled && !isTransitioningRef.current) {
            startTransition(i);
          }
        }, i * SLIDE_TOTAL_MS);
      }
      
      // Schedule finish
      setTimeoutTracked(() => {
        if (!cancelled) {
          finish();
        }
      }, TOTAL_MS);
    };

    const updateProgress = () => {
      if (cancelled) return;
      if (!startTime) startTime = Date.now();
      const elapsed = Date.now() - startTime;
      const progressFill = progressFillRef.current;
      if (progressFill) {
        progressFill.style.width = Math.min(100, (elapsed / TOTAL_MS) * 100) + '%';
      }

      if (elapsed < TOTAL_MS) {
        rafId = requestAnimationFrame(updateProgress);
      } else if (progressFill) {
        progressFill.style.width = '100%';
      }
    };

    runSlideSequence();
    rafId = requestAnimationFrame(updateProgress);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!visible) return null;

  // Determine which slides to render
  const slidesToRender: Array<{ slide: SlideData; state: 'active' | 'enter' | 'exit'; index: number }> = [];
  
  slidesToRender.push({ slide: VALUES[activeIndex], state: isTransitioning ? 'exit' : 'active', index: activeIndex });
  
  if (incomingIndex !== null) {
    slidesToRender.push({ slide: VALUES[incomingIndex], state: 'enter', index: incomingIndex });
  }

  return (
    <div id="preloader" className={done ? 'done' : undefined}>
      <div className="preloader-stage">
        {slidesToRender.map(({ slide, state, index }) => (
          <PreloaderSlide key={`${state}-${index}`} slide={slide} state={state} index={index} />
        ))}
      </div>
      <div className="bg-overlay"></div>
      <div className="vignette"></div>
      <div className="center-rule"></div>
      <div className="dots">
        {VALUES.map((_, i) => (
          <div key={i} className={`dot ${i === (incomingIndex ?? activeIndex) ? 'active' : ''}`} />
        ))}
      </div>
      <div className="brand-strip">
        <img src="/logo.png" alt="RS" />
        <span>Disciplina · Trabajo · Éxito</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" ref={progressFillRef}></div>
      </div>
    </div>
  );
}
