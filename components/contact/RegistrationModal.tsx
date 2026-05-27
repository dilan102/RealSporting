"use client";

import { ReactNode, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { RegistrationForm } from "@/components/contact/RegistrationForm";

type RegistrationModalProps = {
  children: ReactNode;
  className?: string;
};

export function RegistrationModal({ children, className }: RegistrationModalProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const modal = (
    <div
      className="fixed inset-0 z-[9999] grid min-h-[100dvh] place-items-center overflow-y-auto bg-black/72 px-3 py-4 backdrop-blur-md sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Cerrar formulario"
        onClick={() => setOpen(false)}
      />
      <div className="relative z-10 w-full max-w-3xl">
        <div className="registration-modal-panel light-panel relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_28%,var(--border))] bg-bg-elevated p-3 text-text shadow-2xl sm:max-h-[calc(100dvh-4rem)] sm:p-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-bg text-text shadow-lg backdrop-blur-md hover:border-accent hover:text-accent"
            aria-label="Cerrar formulario"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <h2 id={titleId} className="sr-only">
            Formulario de inscripcion
          </h2>
          <RegistrationForm />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {mounted && open ? createPortal(modal, document.body) : null}
    </>
  );
}
