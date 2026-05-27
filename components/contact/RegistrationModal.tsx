"use client";

import { ReactNode, useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { RegistrationForm } from "@/components/contact/RegistrationForm";

type RegistrationModalProps = {
  children: ReactNode;
  className?: string;
};

export function RegistrationModal({ children, className }: RegistrationModalProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

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

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/68 px-4 py-6 backdrop-blur-sm sm:py-10"
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
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/18 bg-bg-elevated text-text shadow-lg backdrop-blur-md hover:border-accent"
                aria-label="Cerrar formulario"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <h2 id={titleId} className="sr-only">
              Formulario de inscripcion
            </h2>
            <RegistrationForm />
          </div>
        </div>
      )}
    </>
  );
}
