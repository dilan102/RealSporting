"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { OdsItem } from "@/lib/content";
import { OdsInfographicPoster } from "@/components/club/OdsInfographicPoster";

type Props = {
  item: OdsItem | null;
  onClose: () => void;
};

export function OdsInfographicModal({ item, onClose }: Props) {
  const [usePoster, setUsePoster] = useState(false);

  useEffect(() => {
    if (!item) {
      return;
    }

    setUsePoster(false);

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

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ods-infographic-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-bg shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6"
          style={{ backgroundColor: item.color }}
        >
          <h2 id="ods-infographic-title" className="text-sm font-black text-white sm:text-base">
            Infografía · {item.code} — {item.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white/25"
            aria-label="Cerrar infografía"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {usePoster ? (
            <OdsInfographicPoster item={item} />
          ) : (
            <div className="relative overflow-hidden rounded-lg border border-border bg-white">
              <Image
                src={item.infographicImage}
                alt={`Infografía ${item.code} — ${item.title}`}
                width={800}
                height={1100}
                className="h-auto w-full"
                onError={() => setUsePoster(true)}
                unoptimized
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
