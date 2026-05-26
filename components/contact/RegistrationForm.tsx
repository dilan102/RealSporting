"use client";

import { FormEvent, useState } from "react";
import { Send, ShieldCheck } from "lucide-react";
import { club, social } from "@/lib/content";

const fieldClass =
  "mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-all duration-300 ease-in-out placeholder:text-zinc-400 focus:border-[var(--accent-green)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--accent-green)_16%,transparent)]";

const labelClass = "text-sm font-black text-zinc-900";

export function RegistrationForm() {
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const body = [
      `Nombre del aspirante: ${formData.get("aspirante")}`,
      `Edad: ${formData.get("edad")}`,
      `Nombre del acudiente: ${formData.get("acudiente")}`,
      `Teléfono: ${formData.get("telefono")}`,
      "",
      `Mensaje: ${formData.get("mensaje")}`,
    ].join("\n");

    const mailto = `mailto:${social.email}?subject=${encodeURIComponent(
      `Inscripción - ${club.name}`
    )}&body=${encodeURIComponent(body)}`;

    setStatus("Abriendo tu correo para enviar la solicitud de inscripción.");
    window.location.href = mailto;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_22%,var(--border))] bg-white p-5 text-zinc-900 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-gold)] hover:shadow-lg sm:p-7"
    >
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-5">
        <span className="grid size-11 place-items-center rounded-lg bg-[var(--accent-green)] text-white">
          <ShieldCheck size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent-green)]">
            Solicitud oficial
          </p>
          <h2 className="text-2xl font-black tracking-tight">
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

      <button
        type="submit"
        className="btn-gold mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-black sm:w-auto"
      >
        Enviar solicitud
        <Send size={18} aria-hidden="true" />
      </button>

      {status && (
        <p className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_24%,transparent)] bg-[color-mix(in_srgb,var(--accent-green)_7%,white)] px-4 py-3 text-sm font-semibold text-[var(--accent-green)]">
          {status}
        </p>
      )}
    </form>
  );
}
