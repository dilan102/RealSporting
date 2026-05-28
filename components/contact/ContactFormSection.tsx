"use client";

import { RegistrationForm } from "@/components/contact/RegistrationForm";
import { RegistrationModal } from "@/components/contact/RegistrationModal";

export function ContactFormSection() {
  return (
    <section
      id="formulario"
      className="light-panel scroll-mt-28 rounded-lg border border-border bg-bg-elevated p-6 shadow-sm sm:p-8"
    >
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent-green)]">
        Inscripción en línea
      </p>
      <h2 className="mt-3 text-2xl font-black">Formulario rápido</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Completa la solicitud y la recibiremos directamente en nuestro correo.
      </p>
      <div className="mt-6">
        <RegistrationForm />
      </div>
      <RegistrationModal className="btn-green mt-4 inline-flex min-h-11 items-center justify-center rounded-lg px-5 text-sm font-black">
        Abrir en ventana emergente
      </RegistrationModal>
    </section>
  );
}
