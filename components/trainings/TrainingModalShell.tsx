"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type TrainingModalShellProps = {
  open: boolean;
  onClose: () => void;
  titleId: string;
  header: ReactNode;
  children: ReactNode;
  maxWidthClassName?: string;
};

export function TrainingModalShell({
  open,
  onClose,
  titleId,
  header,
  children,
  maxWidthClassName = "max-w-6xl",
}: TrainingModalShellProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
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
  }, [open, onClose]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/82 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className={`flex max-h-[min(100dvh-2rem,920px)] w-full flex-col overflow-hidden rounded-lg border border-white/15 bg-black/35 text-white shadow-2xl backdrop-blur-md sm:max-h-[min(100dvh-3rem,920px)] ${maxWidthClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border p-4 sm:p-5">
          <div className="min-w-0 flex-1">{header}</div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
            className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/20 bg-black/45 text-white backdrop-blur transition-colors hover:border-accent hover:text-accent"
            aria-label="Cerrar entrenamiento"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
