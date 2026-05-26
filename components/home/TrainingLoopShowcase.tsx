"use client";

import Image from "next/image";
import Link from "next/link";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Dumbbell, X } from "lucide-react";
import type { Training } from "@/lib/content";
import {
  TRAINING_TEXT_PLACEHOLDER,
  sanitizeVisibleTextOrDefault,
} from "@/lib/validators";

type Props = {
  items: Training[];
};

const trainingBlurDataURL =
  "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwIiB3aWR0aD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMUE0NzJBIi8+PGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjQiIGZpbGw9IiNDOUEyMjciIG9wYWNpdHk9Ii41Ii8+PC9zdmc+";

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function TrainingLoopShowcase({ items }: Props) {
  const orderedItems = useMemo(
    () => [...items].sort((a, b) => b.date.localeCompare(a.date)),
    [items],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState<Training | null>(null);
  const activeTraining = orderedItems[activeIndex] || orderedItems[0];

  useEffect(() => {
    if (orderedItems.length < 2 || expanded) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % orderedItems.length);
    }, 4600);

    return () => window.clearInterval(interval);
  }, [expanded, orderedItems.length]);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded]);

  if (!activeTraining) {
    return null;
  }

  const closeExpanded = (event?: MouseEvent) => {
    event?.stopPropagation();
    setExpanded(null);
  };

  return (
    <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-px bg-border" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mobile-reveal flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Entrenamientos
            </p>
            <h2 className="mt-3 text-[clamp(2.35rem,11vw,3.6rem)] font-black leading-none tracking-tight sm:text-4xl">
              Últimas sesiones del proceso
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Registro visual de las actividades recientes del cuerpo técnico.
            </p>
          </div>
          <Link
            href="/entrenamientos"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-bg-elevated/70 px-4 text-sm font-bold transition-colors hover:border-accent/50 hover:text-accent sm:rounded-lg"
          >
            Ver todos
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.42fr)]">
          <div className="mobile-snap-x mobile-scrollbar-none order-2 grid gap-4 sm:grid-cols-2 lg:order-1 lg:grid-cols-1">
            {orderedItems.slice(0, 3).map((item, index) => {
              const selected = item.id === activeTraining.id;
              const title = sanitizeVisibleTextOrDefault(item.title, "Entrenamiento Real Sporting");
              const description = sanitizeVisibleTextOrDefault(
                item.description,
                TRAINING_TEXT_PLACEHOLDER,
              );

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveIndex(index);
                    setExpanded(item);
                  }}
                  className={`mobile-card-lift group grid min-h-32 grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-[1.4rem] border bg-bg/70 text-left transition-colors sm:rounded-lg ${
                    selected
                      ? "border-accent/60"
                      : "border-border hover:border-accent/40"
                  }`}
                  aria-label={`Expandir entrenamiento: ${title}`}
                >
                  <span className="relative block h-full min-h-32 overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="112px"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={trainingBlurDataURL}
                    />
                  </span>
                  <span className="flex min-w-0 flex-col justify-center p-4">
                    <time className="text-xs font-bold uppercase tracking-[0.12em] text-accent">
                      {formatDate(item.date)}
                    </time>
                    <span className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-text">
                      {title}
                    </span>
                    <span className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                      {description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="order-1 overflow-hidden lg:order-2">
            <AnimatePresence mode="wait">
            <motion.button
                key={activeTraining.id}
                type="button"
                onClick={() => setExpanded(activeTraining)}
                className="mobile-card-lift group relative min-h-[500px] w-full overflow-hidden rounded-[2rem] border border-accent/40 bg-bg text-left shadow-2xl sm:min-h-[410px] sm:rounded-lg"
                initial={{ opacity: 0, x: -54, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 64, scale: 0.97 }}
                transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                aria-label={`Expandir entrenamiento: ${sanitizeVisibleTextOrDefault(activeTraining.title, "Entrenamiento Real Sporting")}`}
              >
                <Image
                  src={activeTraining.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={trainingBlurDataURL}
                />
                <span className="absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-[var(--button-text)] sm:rounded-lg">
                    <Dumbbell size={14} aria-hidden="true" />
                    Entrenamiento
                  </span>
                  <time className="block text-sm font-semibold text-accent-secondary">
                    {formatDate(activeTraining.date)}
                  </time>
                  <span className="mt-3 block max-w-2xl text-3xl font-black leading-[0.98] sm:text-4xl">
                    {sanitizeVisibleTextOrDefault(activeTraining.title, "Entrenamiento Real Sporting")}
                  </span>
                  <span className="mt-4 block max-w-2xl overflow-wrap-anywhere text-sm leading-relaxed text-muted sm:text-base">
                    {sanitizeVisibleTextOrDefault(activeTraining.description, TRAINING_TEXT_PLACEHOLDER)}
                  </span>
                  <span className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-4 text-sm font-bold text-[var(--button-text)] sm:rounded-lg">
                    Expandir entrenamiento
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </span>
              </motion.button>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-bg/90 px-4 py-6 backdrop-blur-md sm:px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeExpanded}
          >
            <motion.article
              className="max-h-[calc(100vh-3rem)] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-border bg-bg-elevated shadow-2xl sm:rounded-lg"
              initial={{ opacity: 0, x: -60, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.96 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative aspect-[16/9]">
                <Image
                  src={expanded.image}
                  alt={sanitizeVisibleTextOrDefault(expanded.title, "Entrenamiento Real Sporting")}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 768px, 100vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={trainingBlurDataURL}
                />
                <button
                  type="button"
                  onClick={closeExpanded}
                  className="absolute right-4 top-4 rounded-full border border-white/20 bg-bg/80 p-2 text-white backdrop-blur transition-colors hover:border-accent sm:rounded-lg"
                  aria-label="Cerrar entrenamiento"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                  Entrenamiento · {formatDate(expanded.date)}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  {sanitizeVisibleTextOrDefault(expanded.title, "Entrenamiento Real Sporting")}
                </h2>
                <p className="mt-5 whitespace-pre-line overflow-wrap-anywhere text-base leading-8 text-muted">
                  {sanitizeVisibleTextOrDefault(expanded.description, TRAINING_TEXT_PLACEHOLDER)}
                </p>
                <Link
                  href="/entrenamientos"
                  className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-[var(--button-text)] transition-colors hover:bg-accent/90 sm:rounded-lg"
                >
                  Ir a entrenamientos
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
