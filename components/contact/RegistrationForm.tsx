"use client";

import { FormEvent, MouseEvent, useState } from "react";
import { Mail, Send, ShieldCheck } from "lucide-react";
import { club, social } from "@/lib/content";
import { buildGmailComposeUrl, buildMailtoUrl } from "@/lib/email";

const fieldClass =
  "mt-2 w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-sm font-medium text-text outline-none transition-all duration-300 ease-in-out placeholder:text-muted/65 focus:border-[var(--accent-green)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--accent-green)_16%,transparent)]";

const labelClass = "text-sm font-black text-text";

type RegistrationFields = {
  aspirante: string;
  edad: string;
  acudiente: string;
  telefono: string;
  mensaje: string;
};

function getRegistrationFields(form: HTMLFormElement): RegistrationFields {
  const formData = new FormData(form);

  return {
    aspirante: String(formData.get("aspirante") ?? "").trim(),
    edad: String(formData.get("edad") ?? "").trim(),
    acudiente: String(formData.get("acudiente") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
    mensaje: String(formData.get("mensaje") ?? "").trim(),
  };
}

function buildRegistrationDraft(fields: RegistrationFields) {
  const subject = `Inscripcion - ${club.name}`;
  const body = [
    `Nombre del aspirante: ${fields.aspirante}`,
    `Edad: ${fields.edad}`,
    `Nombre del acudiente: ${fields.acudiente}`,
    `Telefono: ${fields.telefono}`,
    "",
    `Mensaje: ${fields.mensaje}`,
  ].join("\n");

  return {
    gmailUrl: buildGmailComposeUrl({ to: social.email, subject, body }),
    mailtoUrl: buildMailtoUrl({ to: social.email, subject, body }),
  };
}

export function RegistrationForm() {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [mailFallback, setMailFallback] = useState({
    gmailUrl: buildGmailComposeUrl({
      to: social.email,
      subject: `Inscripcion - ${club.name}`,
      body: "",
    }),
    mailtoUrl: buildMailtoUrl({
      to: social.email,
      subject: `Inscripcion - ${club.name}`,
      body: "",
    }),
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setError("");
    setSending(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    setMailFallback(buildRegistrationDraft(getRegistrationFields(form)));

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "No se pudo enviar la solicitud.");
      }

      setStatus(payload.message ?? "Solicitud enviada correctamente.");
      setMailFallback(
        buildRegistrationDraft({
          aspirante: "",
          edad: "",
          acudiente: "",
          telefono: "",
          mensaje: "",
        })
      );
      form.reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo enviar la solicitud. Inténtalo nuevamente."
      );
    } finally {
      setSending(false);
    }
  };

  const handleGmailClick = (event: MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.form;

    if (!form) {
      return;
    }

    const draft = buildRegistrationDraft(getRegistrationFields(form));
    setMailFallback(draft);
    window.open(draft.gmailUrl, "_blank", "noopener,noreferrer");
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
            Solicitud oficial
          </p>
          <h2 className="overflow-wrap-anywhere text-2xl font-black tracking-tight">
            Formulario de inscripción
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Nombre del aspirante</span>
          <input
            className={fieldClass}
            name="aspirante"
            type="text"
            autoComplete="name"
            required
            placeholder="Nombre completo"
          />
        </label>

        <label className="block">
          <span className={labelClass}>Edad</span>
          <input
            className={fieldClass}
            name="edad"
            type="number"
            min="4"
            max="25"
            required
            placeholder="Ej. 12"
          />
        </label>

        <label className="block">
          <span className={labelClass}>Nombre del acudiente</span>
          <input
            className={fieldClass}
            name="acudiente"
            type="text"
            autoComplete="name"
            required
            placeholder="Nombre completo"
          />
        </label>

        <label className="block">
          <span className={labelClass}>Teléfono</span>
          <input
            className={fieldClass}
            name="telefono"
            type="tel"
            autoComplete="tel"
            required
            placeholder="Número de contacto"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelClass}>Mensaje</span>
          <textarea
            className={`${fieldClass} min-h-32 resize-y`}
            name="mensaje"
            required
            placeholder="Cuéntanos categoría, disponibilidad o información importante."
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
        <button
          type="submit"
          disabled={sending}
          className="btn-gold inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {sending ? "Enviando..." : "Enviar solicitud"}
          <Send size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleGmailClick}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-bg px-5 text-sm font-black text-text shadow-sm hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] hover:shadow-lg sm:w-auto"
        >
          Enviar por Gmail
          <Mail size={18} aria-hidden="true" />
        </button>
      </div>

      {status && (
        <p className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_24%,transparent)] bg-[color-mix(in_srgb,var(--accent-green)_10%,var(--card-bg))] px-4 py-3 text-sm font-semibold text-[var(--accent-green)]">
          {status}
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-300">
          <p>{error}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href={mailFallback.gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-current px-3 py-2 text-xs font-black hover:bg-bg"
            >
              Abrir Gmail
              <Mail size={15} aria-hidden="true" />
            </a>
            <a
              href={mailFallback.mailtoUrl}
              className="inline-flex items-center gap-2 rounded-lg border border-current px-3 py-2 text-xs font-black hover:bg-bg"
            >
              Usar correo
              <Send size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
