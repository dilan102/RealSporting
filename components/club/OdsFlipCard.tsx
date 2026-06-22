"use client";

import Image from "next/image";
import { useCallback, useState, type MouseEvent, type KeyboardEvent } from "react";
import { FileText, RotateCcw } from "lucide-react";
import type { OdsItem } from "@/lib/content";
import { odsIcons } from "@/components/club/ods-icons";

type Props = {
  item: OdsItem;
  variant?: "club" | "home";
  onOpenInfographic: (item: OdsItem) => void;
};

export function OdsFlipCard({ item, variant = "club", onOpenInfographic }: Props) {
  const [flipped, setFlipped] = useState(false);
  const Icon = odsIcons[item.id];
  const minHeight = variant === "club" ? "min-h-[28rem]" : "min-h-[22rem]";

  const toggleFlip = useCallback(() => {
    setFlipped((current) => !current);
  }, []);

  const openDocument = useCallback(
    (event: MouseEvent | KeyboardEvent) => {
      event.stopPropagation();
      onOpenInfographic(item);
    },
    [item, onOpenInfographic],
  );

  return (
    <article
      id={variant === "club" ? item.id : undefined}
      className={`ods-flip-scene scroll-mt-32 ${variant === "club" ? "" : "h-full"}`}
    >
      <button
        type="button"
        onClick={toggleFlip}
        aria-expanded={flipped}
        aria-label={
          flipped
            ? `Volver al resumen de ${item.title}`
            : `Ver más información de ${item.title}`
        }
        className={`ods-flip-inner group w-full rounded-lg border border-border bg-bg-elevated text-left shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${minHeight} ${flipped ? "is-flipped" : ""}`}
      >
        <div className="ods-flip-face flex flex-col">
          <div className="relative h-full shrink-0">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="image-card-overlay absolute inset-0" />
          </div>
        </div>

        <div className="ods-flip-face ods-flip-back relative flex flex-col overflow-hidden bg-bg-elevated">
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <Image
              src="/logo.png"
              alt=""
              width={320}
              height={320}
              className="max-h-[72%] max-w-[72%] object-contain opacity-[0.09]"
            />
          </div>

          <div
            className="relative z-10 px-4 py-3 text-white sm:px-5"
            style={{ backgroundColor: item.color }}
          >
            <p className="text-xs font-black uppercase tracking-widest">
              {item.code} · {item.title}
            </p>
          </div>

          <div className="relative z-10 flex flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-5">
            <p className="text-sm leading-7 text-text">{item.backText}</p>
            <p className="rounded-lg border border-border/80 bg-bg/80 px-3 py-3 text-sm leading-6 text-muted backdrop-blur-[2px]">
              <span className="font-black text-text">Impacto: </span>
              {item.impact}
            </p>
            <p
              className="rounded-lg px-3 py-3 text-sm font-black leading-6 text-white"
              style={{ backgroundColor: `color-mix(in srgb, ${item.color} 88%, transparent)` }}
            >
              «{item.clubObjective}»
            </p>
            <div
              onClick={openDocument}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openDocument(e);
                }
              }}
              className="btn-green alive-lift mt-auto inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black text-white cursor-pointer"
            >
              <FileText size={16} aria-hidden="true" />
              Abrir PDF
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}
