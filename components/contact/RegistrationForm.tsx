"use client";

import { FormEvent, useMemo, useState } from "react";
import { Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { social } from "@/lib/content";
import { buildGmailComposeUrl, buildMailtoUrl } from "@/lib/email";

const fieldClass =
  "mt-2 w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-sm font-medium text-text outline-none transition-all duration-300 ease-in-out placeholder:text-muted/65 focus:border-[var(--accent-green)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--accent-green)_16%,transparent)]";

const labelClass = "text-sm font-black text-text";

type RegistrationFields = {
  nombre: string;
  anioNacimiento: string;
  acudiente: string;
};

function buildRegistrationDraft(fields: RegistrationFields) {
  const subject = "Nueva Inscripcion - Real Sporting";
  const message = `Hola Real Sporting, quiero inscribir a mi hijo. Nombre: ${fields.nombre}, Año de nacimiento: ${fields.anioNacimiento}, Acudiente: ${fields.acudiente}`;
  const body = [
    "Hola Real Sporting, quiero inscribir a mi hijo.",
    `Nombre: ${fields.nombre}`,
    `Año de nacimiento: ${fields.anioNacimiento}`,
    `Acudiente: ${fields.acudiente}`,
  ].join("\n");
  const cleanedPhone = social.phone.replace(/\D/g, "");

  return {
    whatsappUrl: `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`,
    gmailUrl: buildGmailComposeUrl({ to: social.email, subject, body }),
    mailtoUrl: buildMailtoUrl({ to: social.email, subject, body }),
  };
}

export function RegistrationForm() {
  const [fields, setFields] = useState<RegistrationFields>({
    nombre: "",
    anioNacimiento: "",
    acudiente: "",
  });
  const draft = useMemo(() => buildRegistrationDraft(fields), [fields]);
  const isReady = Boolean(fields.nombre && fields.anioNacimiento && fields.acudiente);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="light-panel rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_22%,var(--border))] bg-bg-elevated p-5 text-text shadow-sm transition-all duration-300 ease-in-out hover:border-[var(--accent-gold)] hover:shadow-lg sm:p-7"
    >
      <div className="flex items-center gap-3 border-b border-border pb-5 pr-12">
        <span className="grid size-11 place-items-center rounded-lg bg-[var(--accent-green)] text-white">
          <ShieldCheck size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent-green)]">
            Inscripcion rapida
          </p>
          <h2 className="overflow-wrap-anywhere text-2xl font-black tracking-tight">
            Ventana de registro interactiva
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Nombre completo del aspirante</span>
          <input
            className={fieldClass}
            name="nombre"
            type="text"
            autoComplete="name"
            required
            placeholder="Nombre completo"
            value={fields.nombre}
            onChange={(event) =>
              setFields((current) => ({ ...current, nombre: event.target.value }))
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>Año de nacimiento</span>
          <input
            className={fieldClass}
            name="anioNacimiento"
            type="number"
            min="1990"
            max={new Date().getFullYear()}
            required
            placeholder="Ej. 2014"
            value={fields.anioNacimiento}
            onChange={(event) =>
              setFields((current) => ({ ...current, anioNacimiento: event.target.value }))
            }
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelClass}>Nombre del acudiente</span>
          <input
            className={fieldClass}
            name="acudiente"
            type="text"
            autoComplete="name"
            required
            placeholder="Nombre completo"
            value={fields.acudiente}
            onChange={(event) =>
              setFields((current) => ({ ...current, acudiente: event.target.value }))
            }
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3">
        <a
          href={isReady ? draft.whatsappUrl : "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            if (!isReady) {
              event.preventDefault();
            }
          }}
          className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-lg px-5 text-sm font-black transition-all ${
            isReady
              ? "bg-[#25D366] text-white shadow-lg shadow-[#25D366]/25 hover:scale-[1.01]"
              : "cursor-not-allowed bg-[#25D366]/35 text-white/70"
          }`}
        >
          Enviar por WhatsApp
          <MessageCircle size={18} aria-hidden="true" />
        </a>
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={isReady ? draft.gmailUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              if (!isReady) {
                event.preventDefault();
              }
            }}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black transition-all ${
              isReady
                ? "border border-[#EA4335] bg-white text-[#EA4335] hover:bg-[#EA4335] hover:text-white"
                : "cursor-not-allowed border border-border bg-bg text-muted"
            }`}
          >
            Gmail
            <Mail size={18} aria-hidden="true" />
          </a>
          <a
            href={isReady ? draft.mailtoUrl : "#"}
            onClick={(event) => {
              if (!isReady) {
                event.preventDefault();
              }
            }}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-black transition-all ${
              isReady
                ? "border-border bg-bg text-text hover:border-accent hover:text-accent"
                : "cursor-not-allowed border border-border bg-bg text-muted"
            }`}
          >
            Correo
            <Mail size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold text-muted">
        Completa los 3 datos para habilitar la redireccion automatica por WhatsApp o correo.
      </p>
    </form>
  );
}
