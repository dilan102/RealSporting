"use client";

import Image from "next/image";
import { useEffect } from "react";
import { X } from "lucide-react";
import type { OdsItem } from "@/lib/content";

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

  const isPdf = item.documentType === "pdf";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ods-infographic-title"
      onClick={onClose}
    >
      <div
        className={`relative flex w-full flex-col overflow-hidden rounded-lg bg-bg shadow-2xl ${
          isPdf ? "max-h-[92vh] max-w-5xl" : "max-h-[92vh] max-w-3xl overflow-y-auto"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-4 py-3 sm:px-6"
          style={{ backgroundColor: item.color }}
        >
          <h2 id="ods-infographic-title" className="text-sm font-black text-white sm:text-base">
            {item.code} — {item.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-lg bg-white/15 text-white transition-colors hover:bg-white/25"
            aria-label="Cerrar documento"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className={isPdf ? "min-h-0 flex-1 bg-white" : "p-4 sm:p-6"}>
          {isPdf ? (
            <iframe
              src={item.documentUrl}
              title={`Infografía oficial ${item.code}`}
              className="h-[min(78vh,820px)] w-full border-0"
            />
          ) : (
            <div className="relative overflow-hidden rounded-lg border border-border bg-white">
              <Image
                src={item.documentUrl}
                alt={`Infografía oficial ${item.code} — ${item.title}`}
                width={1200}
                height={1600}
                className="h-auto w-full"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
