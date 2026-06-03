"use client";

import { useEffect } from "react";
import { ExternalLink, X } from "lucide-react";
import type { OdsItem } from "@/lib/content";
import { odsDrivePreviewUrl } from "@/lib/ods-drive";

type Props = {
  item: OdsItem | null;
  onClose: () => void;
};

export function OdsInfographicModal({ item, onClose }: Props) {
  useEffect(() => {
    if (!item) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [item, onClose]);

  if (!item) {
    return null;
  }

  const previewUrl = odsDrivePreviewUrl(item.documentUrl);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ods-infographic-title"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-bg shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6"
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
              Abrir en Drive
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

        <div className="min-h-0 flex-1 bg-white">
          <iframe
            src={previewUrl}
            title={`Infografía oficial ${item.code} — ${item.title}`}
            className="h-[min(78vh,820px)] w-full border-0"
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
}
