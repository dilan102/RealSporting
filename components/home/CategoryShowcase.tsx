"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { sportCategoryCards } from "@/lib/content";
import { PRELOADER_EASE } from "@/lib/preloader";

function getItemsPerPage() {
  if (typeof window === "undefined") {
    return 1;
  }

  if (window.matchMedia("(min-width: 1280px)").matches) {
    return 4;
  }

  if (window.matchMedia("(min-width: 768px)").matches) {
    return 2;
  }

  return 1;
}

export function CategoryShowcase() {
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const maxStart = Math.max(0, sportCategoryCards.length - itemsPerPage);
  const [start, setStart] = useState(0);

  useLayoutEffect(() => {
    setItemsPerPage(getItemsPerPage());
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const update = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setItemsPerPage(getItemsPerPage());
      }, 150); // Debounce resize events
    };

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      clearTimeout(timeoutId);
    };
  }, []);

  const clampedStart = Math.min(start, maxStart);
  const visibleCategories = sportCategoryCards.slice(
    clampedStart,
    clampedStart + itemsPerPage,
  );
  const canGoPrev = clampedStart > 0;
  const canGoNext = clampedStart < maxStart;
  const isPartialPage = visibleCategories.length < itemsPerPage;

  useEffect(() => {
    setStart((current) => Math.min(current, maxStart));
  }, [maxStart]);

  const goPrev = useCallback(() => {
    setStart((current) => Math.max(0, Math.min(current, maxStart) - itemsPerPage));
  }, [itemsPerPage, maxStart]);

  const goNext = useCallback(() => {
    setStart((current) =>
      Math.min(maxStart, Math.min(current, maxStart) + itemsPerPage),
    );
  }, [itemsPerPage, maxStart]);

  return (
    <section className="section-band-strong section-ambient text-text">
      <div className="section-shell section-padding">
        <div className="flex flex-col gap-5 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Categorías</p>
            <h2 className="font-categories kinetic-heading mt-4 text-balance text-4xl font-black leading-[0.92] sm:text-5xl lg:text-7xl">
              Un proceso por edades, con objetivos claros para cada etapa.
            </h2>
          </div>
          <Link
            href="/equipo"
            className="alive-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 text-sm font-black text-text transition-all hover:border-accent hover:text-accent"
          >
            Ver todas
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="relative mt-8 px-12 sm:px-14 lg:px-16">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label="Ver categorías anteriores"
            className="alive-lift absolute left-0 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-lg border border-border bg-bg-elevated text-text transition-all hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            aria-label="Ver más categorías"
            className="alive-lift absolute right-0 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-lg border border-border bg-bg-elevated text-text transition-all hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${clampedStart}-${itemsPerPage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.32, ease: PRELOADER_EASE }}
              className={`grid gap-4 ${
                isPartialPage
                  ? "justify-items-center md:grid-cols-2 xl:flex xl:flex-wrap xl:justify-center"
                  : "md:grid-cols-2 xl:grid-cols-4"
              }`}
            >
              {visibleCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/equipo#categoria-${category.id}`}
                  className={`cinematic-card alive-card premium-card-hover group relative min-h-[360px] overflow-hidden rounded-lg border border-border ${
                    isPartialPage ? "w-full max-w-sm xl:w-[calc(25%-0.75rem)]" : ""
                  }`}
                >
                  <Image
                    src={category.image}
                    alt={`Categoría ${category.name}`}
                    fill
                    className="interactive-image object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="image-card-overlay absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="cinematic-accent text-xs font-black uppercase tracking-normal">
                      {category.range}
                    </p>
                    <h3 className="font-categories mt-2 text-4xl font-black leading-none">
                      {category.name}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/82">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>

          <p className="mt-4 text-center text-xs font-black uppercase tracking-normal text-muted">
            {clampedStart + 1}–{clampedStart + visibleCategories.length} de{" "}
            {sportCategoryCards.length} categorías
          </p>
        </div>
      </div>
    </section>
  );
}
