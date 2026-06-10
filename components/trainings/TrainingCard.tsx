"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  Pencil,
  Play,
  Trash2,
} from "lucide-react";
import type { Training } from "@/lib/content";
import { PublicationDateText } from "@/components/ui/PublicationDateText";
import { TrainingModalShell } from "./TrainingModalShell";
import {
  TRAINING_TEXT_PLACEHOLDER,
  sanitizeVisibleTextOrDefault,
} from "@/lib/validators";

const trainingBlurDataURL =
  "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjEwIiB3aWR0aD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMUE0NzJBIi8+PGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjQiIGZpbGw9IiNDOUEyMjciIG9wYWNpdHk9Ii41Ii8+PC9zdmc+";

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

function TrainingPlaceholder() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,var(--accent-green),var(--accent-gold),#111111)]">
      <div className="grid size-24 place-items-center rounded-lg border border-white/25 bg-black/20 p-4 shadow-2xl backdrop-blur-md">
        <Image
          src="/logo.png"
          alt=""
          width={68}
          height={68}
          className="object-contain"
          aria-hidden="true"
        />
      </div>
    </div>
  );
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
  const mediaCount = media.length;
  const safeMediaIndex =
    mediaCount === 0 ? 0 : Math.min(activeMedia, mediaCount - 1);
  const currentMedia = media[safeMediaIndex];
  const mainMedia = media[0];
  const title = sanitizeVisibleTextOrDefault(training.title, "Entrenamiento Real Sporting");
  const imageAlt = `Sesión de entrenamiento - ${training.date}`;
  const description = sanitizeVisibleTextOrDefault(
    training.description,
    TRAINING_TEXT_PLACEHOLDER,
  );

  useEffect(() => {
    if (open) {
      setActiveMedia(0);
    }
  }, [open, training.id]);

  const showPrevious = () => {
    setActiveMedia((current) => (current === 0 ? mediaCount - 1 : current - 1));
  };

  const showNext = () => {
    setActiveMedia((current) => (current === mediaCount - 1 ? 0 : current + 1));
  };

  return (
    <>
      <article
        className="alive-card animate-fade-in glass mobile-card-lift group overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-[var(--accent-gold)]/15"
      >
        <button
          type="button"
          onClick={() => {
            setActiveMedia(0);
            setOpen(true);
          }}
          className="relative block aspect-[16/10] w-full overflow-hidden text-left"
          aria-label={`Abrir entrenamiento ${title}`}
        >
          {!mainMedia ? (
            <TrainingPlaceholder />
          ) : mainMedia.type === "image" ? (
            <Image
              src={mainMedia.src}
              alt={imageAlt}
              fill
              className="interactive-image object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL={trainingBlurDataURL}
            />
          ) : (
            <video
              src={mainMedia.src}
              className="interactive-image h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              muted
              playsInline
              preload="metadata"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
          <PublicationDateText
            startDate={training.date}
            endDate={training.endDate}
            className="absolute left-4 top-4 rounded-lg bg-bg/80 px-3 py-1 text-xs font-medium text-accent backdrop-blur"
          />
          {mainMedia?.type === "video" && (
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
          <h3 className="font-training line-clamp-2 overflow-wrap-anywhere text-2xl font-bold leading-none">{title}</h3>
          <p className="mt-2 line-clamp-3 overflow-wrap-anywhere text-sm leading-relaxed text-muted">
            {description}
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
      </article>

      <TrainingModalShell
        open={open}
        onClose={() => setOpen(false)}
        titleId={`training-${training.id}-title`}
        header={
          <>
            <PublicationDateText
              startDate={training.date}
              endDate={training.endDate}
              className="text-xs font-bold uppercase tracking-normal text-accent"
            />
            <h2
              id={`training-${training.id}-title`}
              className="mt-2 text-2xl font-black leading-tight sm:text-3xl"
            >
              {title}
            </h2>
          </>
        }
      >
        <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          <div className="relative h-[min(52vh,480px)] min-h-[240px] bg-black sm:min-h-[320px]">
            {mediaCount === 0 ? (
              <>
                <TrainingPlaceholder />
                <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/20 bg-black/55 px-4 py-3 text-center text-sm text-white/90 backdrop-blur">
                  Este entrenamiento aun no tiene fotos o videos disponibles.
                </div>
              </>
            ) : currentMedia?.type === "image" ? (
              <Image
                src={currentMedia.src}
                alt={`${title} ${safeMediaIndex + 1}`}
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 65vw, 100vw"
                priority
                placeholder="blur"
                blurDataURL={trainingBlurDataURL}
              />
            ) : currentMedia ? (
              <video
                key={currentMedia.src}
                src={currentMedia.src}
                className="h-full w-full object-contain"
                controls
                playsInline
              />
            ) : null}
            {mediaCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-4 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-lg bg-bg/80 text-text backdrop-blur transition-colors hover:bg-accent hover:text-[var(--button-text)]"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={22} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-4 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-lg bg-bg/80 text-text backdrop-blur transition-colors hover:bg-accent hover:text-[var(--button-text)]"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight size={22} aria-hidden="true" />
                </button>
              </>
            )}
          </div>

          <aside className="p-5 sm:p-6">
            <p className="overflow-wrap-anywhere text-sm leading-7 text-muted">{description}</p>
            {mediaCount > 1 && (
              <div className="mt-6 grid grid-cols-4 gap-2">
                {media.map((item, index) => (
                  <button
                    key={`${item.src}-${index}`}
                    type="button"
                    onClick={() => setActiveMedia(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border transition-colors ${
                      safeMediaIndex === index
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
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={trainingBlurDataURL}
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
      </TrainingModalShell>
    </>
  );
}
