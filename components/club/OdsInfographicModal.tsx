"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Loader2, X } from "lucide-react";
import type { OdsItem } from "@/lib/content";
import { getOdsEmbedSource, odsPdfViewerSrc } from "@/lib/ods-embed";

type Props = {
  item: OdsItem | null;
  onClose: () => void;
};

function lockPageScroll() {
  const scrollY = window.scrollY;
  const { style } = document.body;
  style.overflow = "hidden";
  style.position = "fixed";
  style.top = `-${scrollY}px`;
  style.left = "0";
  style.right = "0";
  style.width = "100%";

  return () => {
    style.overflow = "";
    style.position = "";
    style.top = "";
    style.left = "";
    style.right = "";
    style.width = "";
    window.scrollTo(0, scrollY);
  };
}

export function OdsInfographicModal({ item, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!item) {
      return;
    }

    setLoading(true);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const unlockScroll = lockPageScroll();
    window.addEventListener("keydown", onKeyDown);

    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [item, onClose]);

  if (!mounted || !item) {
    return null;
  }

  const embed = getOdsEmbedSource(item);
  const viewerSrc = embed.kind === "pdf" ? odsPdfViewerSrc(embed.src) : embed.src;

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex flex-col bg-black/80 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ods-infographic-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Cerrar documento"
        onClick={onClose}
      />

      <div
        className="relative z-10 mx-auto flex h-[min(100dvh-1.5rem,920px)] min-h-0 w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-bg shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5"
          style={{ backgroundColor: item.color }}
        >
          <h2 id="ods-infographic-title" className="text-sm font-black text-white sm:text-base">
            Infografía oficial · {item.code}
          </h2>
          <div className="flex items-center gap-2">
            <a
              href={item.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-white/15 px-3 text-xs font-black uppercase tracking-normal text-white transition-colors hover:bg-white/25"
            >
              <ExternalLink size={14} aria-hidden="true" />
              Drive
            </a>
            <button
              type="button"
              onClick={onClose}
              className="grid size-10 place-items-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white/25"
              aria-label="Cerrar documento"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 bg-[#1a1f1c]">
          {loading ? (
            <div className="absolute inset-0 z-10 grid place-items-center bg-bg text-muted">
              <Loader2 size={32} className="animate-spin text-accent" aria-hidden="true" />
              <span className="sr-only">Cargando documento</span>
            </div>
          ) : null}

          {embed.kind === "image" ? (
            <div className="absolute inset-0 overflow-y-auto bg-white p-3 sm:p-5">
              <Image
                key={viewerSrc}
                src={viewerSrc}
                alt={`Infografía oficial ${item.code} — ${item.title}`}
                width={1200}
                height={1600}
                className="mx-auto h-auto w-full max-w-3xl"
                unoptimized
                onLoad={() => setLoading(false)}
              />
            </div>
          ) : (
            <iframe
              key={viewerSrc}
              src={viewerSrc}
              title={`Infografía oficial ${item.code} — ${item.title}`}
              className="absolute inset-0 h-full w-full border-0 bg-white"
              onLoad={() => setLoading(false)}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
