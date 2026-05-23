"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  Pencil,
  Play,
  Trash2,
  X,
} from "lucide-react";
import type { Training } from "@/lib/content";
import { fadeUpItem } from "@/lib/motion";

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getTrainingImages(training: Training) {
  return training.images && training.images.length > 0
    ? training.images
    : training.image
      ? [training.image]
      : [];
}

function getTrainingMedia(training: Training) {
  return [
    ...getTrainingImages(training).map((src) => ({ type: "image" as const, src })),
    ...(training.videos || []).map((src) => ({ type: "video" as const, src })),
  ];
}

type TrainingCardProps = {
  training: Training;
  canManage?: boolean;
  onEdit?: (training: Training) => void;
  onDelete?: (id: string) => void;
};

export function TrainingCard({
  training,
  canManage = false,
  onEdit,
  onDelete,
}: TrainingCardProps) {
  const [open, setOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);
  const media = getTrainingMedia(training);
  const mainMedia = media[0];
  const mediaCount = media.length;

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const showPrevious = () => {
    setActiveMedia((current) => (current === 0 ? mediaCount - 1 : current - 1));
  };

  const showNext = () => {
    setActiveMedia((current) => (current === mediaCount - 1 ? 0 : current + 1));
  };

  if (!mainMedia) {
    return null;
  }

  return (
    <>
      <motion.article
        variants={fadeUpItem}
        className="glass group overflow-hidden rounded-lg transition-colors duration-300 hover:border-accent/30"
      >
        <button
          type="button"
          onClick={() => {
            setActiveMedia(0);
            setOpen(true);
          }}
          className="relative block aspect-[16/10] w-full overflow-hidden text-left"
          aria-label={`Abrir entrenamiento ${training.title}`}
        >
          {mainMedia.type === "image" ? (
            <Image
              src={mainMedia.src}
              alt={training.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <video
              src={mainMedia.src}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              muted
              playsInline
              preload="metadata"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
          <time className="absolute left-4 top-4 rounded-lg bg-bg/80 px-3 py-1 text-xs font-medium text-accent backdrop-blur">
            {formatDate(training.date)}
          </time>
          {mainMedia.type === "video" && (
            <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-bg/80 text-accent backdrop-blur">
              <Play size={22} aria-hidden="true" />
            </span>
          )}
          {mediaCount > 1 && (
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-lg bg-bg/80 px-3 py-1 text-xs font-bold text-text backdrop-blur">
              <Images size={14} aria-hidden="true" />
              {mediaCount}
            </span>
          )}
        </button>

        <div className="p-6">
          <h3 className="text-lg font-semibold">{training.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
            {training.description}
          </p>
          {canManage && (
            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => onEdit?.(training)}
                className="inline-flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/15"
              >
                <Pencil size={14} aria-hidden="true" />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(training.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-400/25 bg-red-400/10 px-4 py-2 text-xs font-semibold text-red-300 transition-colors hover:bg-red-400/15"
              >
                <Trash2 size={14} aria-hidden="true" />
                Borrar
              </button>
            </div>
          )}
        </div>
      </motion.article>

      {open && (
        <div
          className="fixed inset-0 z-[80] bg-black/70 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`training-${training.id}-title`}
        >
          <div className="mx-auto flex max-h-[calc(100vh-2rem)] max-w-6xl flex-col overflow-hidden rounded-lg border border-border bg-bg text-text shadow-2xl sm:max-h-[calc(100vh-3rem)]">
            <div className="flex items-start justify-between gap-4 border-b border-border p-4 sm:p-5">
              <div>
                <time className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                  {formatDate(training.date)}
                </time>
                <h2
                  id={`training-${training.id}-title`}
                  className="mt-2 text-2xl font-black leading-tight sm:text-3xl"
                >
                  {training.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-muted transition-colors hover:border-accent/40 hover:text-text"
                aria-label="Cerrar entrenamiento"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
              <div className="relative min-h-[280px] bg-black sm:min-h-[420px] lg:min-h-[620px]">
                {media[activeMedia].type === "image" ? (
                  <Image
                    src={media[activeMedia].src}
                    alt={`${training.title} ${activeMedia + 1}`}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 65vw, 100vw"
                  />
                ) : (
                  <video
                    key={media[activeMedia].src}
                    src={media[activeMedia].src}
                    className="h-full w-full object-contain"
                    controls
                    playsInline
                  />
                )}
                {mediaCount > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={showPrevious}
                      className="absolute left-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg bg-bg/80 text-text backdrop-blur transition-colors hover:bg-accent hover:text-bg"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft size={22} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      className="absolute right-4 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-lg bg-bg/80 text-text backdrop-blur transition-colors hover:bg-accent hover:text-bg"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight size={22} aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>

              <aside className="p-5 sm:p-6">
                <p className="text-sm leading-7 text-muted">{training.description}</p>
                {mediaCount > 1 && (
                  <div className="mt-6 grid grid-cols-4 gap-2">
                    {media.map((item, index) => (
                      <button
                        key={`${item.src}-${index}`}
                        type="button"
                        onClick={() => setActiveMedia(index)}
                        className={`relative aspect-square overflow-hidden rounded-lg border transition-colors ${
                          activeMedia === index
                            ? "border-accent"
                            : "border-border hover:border-accent/50"
                        }`}
                        aria-label={`Ver medio ${index + 1}`}
                      >
                        {item.type === "image" ? (
                          <Image
                            src={item.src}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <>
                            <video
                              src={item.src}
                              className="h-full w-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                            />
                            <span className="absolute inset-0 grid place-items-center bg-black/25 text-white">
                              <Play size={18} aria-hidden="true" />
                            </span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
