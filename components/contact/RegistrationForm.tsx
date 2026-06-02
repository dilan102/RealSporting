"use client";

import { FormEvent, useState } from "react";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { getEmailJsConfig, sendEmailJsMessage } from "@/lib/emailjs";
import { social } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/constants";

const fieldClass =
  "mt-2 w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-sm font-medium text-text outline-none transition-all duration-300 ease-in-out placeholder:text-muted/65 focus:border-[var(--accent-green)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--accent-green)_16%,transparent)]";

const labelClass = "text-sm font-black text-text";

type RegistrationFields = {
  nombreCompleto: string;
  correo: string;
  telefono: string;
  categoria: string;
  mensaje: string;
};

type FormStatus = "idle" | "sending" | "enviado" | "error";

type RegistrationApiResponse = {
  message?: string;
};

function buildWhatsAppFallbackMessage(fields: RegistrationFields) {
  return [
    "Hola Real Sporting, quiero información sobre inscripción.",
    `Nombre: ${fields.nombreCompleto}`,
    `Correo: ${fields.correo}`,
    `Teléfono: ${fields.telefono || "No registrado"}`,
    `Categoría: ${fields.categoria}`,
    fields.mensaje ? `Mensaje: ${fields.mensaje}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function RegistrationForm() {
  const [fields, setFields] = useState<RegistrationFields>({
    nombreCompleto: "",
    correo: "",
    telefono: "",
    categoria: "Pre-Benjamín",
    mensaje: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { isConfigured } = getEmailJsConfig();

    try {
      setStatus("sending");
      setErrorMessage("");

      const fallbackToApi = async () => {
        const response = await fetch("/api/registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aspirante: fields.nombreCompleto,
            edad: fields.categoria,
            acudiente: fields.nombreCompleto,
            telefono: fields.telefono || "No registrado",
            correo: fields.correo,
            mensaje: `Categoría: ${fields.categoria}. ${fields.mensaje || "Solicitud de inscripción."}`,
          }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as RegistrationApiResponse | null;
          throw new Error(payload?.message || "No se pudo enviar la solicitud.");
        }
      };

      if (isConfigured) {
        const mensaje = [
          `Categoría de interés: ${fields.categoria}`,
          fields.mensaje || "Sin mensaje adicional.",
        ].join("\n");

        await sendEmailJsMessage({
          nombre: fields.nombreCompleto,
          correo: fields.correo,
          telefono: fields.telefono,
          categoria: fields.categoria,
          mensaje,
        });
      } else {
        await fallbackToApi();
      }

      setStatus("enviado");
      setFields({
        nombreCompleto: "",
        correo: "",
        telefono: "",
        categoria: "Pre-Benjamín",
        mensaje: "",
      });
    } catch (error) {
      // If EmailJS is configured but fails (template/service/key), try server fallback once.
      if (isConfigured) {
        try {
          const response = await fetch("/api/registration", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              aspirante: fields.nombreCompleto,
              edad: fields.categoria,
              acudiente: fields.nombreCompleto,
              telefono: fields.telefono || "No registrado",
              correo: fields.correo,
              mensaje: `Categoría: ${fields.categoria}. ${fields.mensaje || "Solicitud de inscripción."}`,
            }),
          });

          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as RegistrationApiResponse | null;
            throw new Error(payload?.message || "No se pudo enviar la solicitud.");
          }

          setStatus("enviado");
          setFields({
            nombreCompleto: "",
            correo: "",
            telefono: "",
            categoria: "Pre-Benjamín",
            mensaje: "",
          });
          return;
        } catch {
          // continue to show actionable error below
        }
      }

      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo enviar la solicitud. Revisa la configuración de EmailJS o Resend.",
      );
    }
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
          <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
            Formulario rápido
          </p>
          <h2 className="overflow-wrap-anywhere text-2xl font-black tracking-normal">
            Solicitud de inscripción
          </h2>
        </div>
      </div>

      <p className="mt-5 text-sm text-muted">
        Completa la solicitud y la recibiremos directamente en nuestro correo.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Nombre completo</span>
          <input
            className={fieldClass}
            name="nombreCompleto"
            type="text"
            autoComplete="name"
            required
            placeholder="Nombre completo"
            value={fields.nombreCompleto}
            onChange={(event) =>
              setFields((current) => ({ ...current, nombreCompleto: event.target.value }))
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>Correo electrónico</span>
          <input
            className={fieldClass}
            name="correo"
            type="email"
            autoComplete="email"
            required
            placeholder="nombre@correo.com"
            value={fields.correo}
            onChange={(event) =>
              setFields((current) => ({ ...current, correo: event.target.value }))
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>Teléfono / WhatsApp (opcional)</span>
          <input
            className={fieldClass}
            name="telefono"
            type="tel"
            placeholder="+57 320 905 9855"
            value={fields.telefono}
            onChange={(event) =>
              setFields((current) => ({ ...current, telefono: event.target.value }))
            }
          />
        </label>

        <label className="block">
          <span className={labelClass}>Categoría de interés</span>
          <select
            className={fieldClass}
            name="categoria"
            value={fields.categoria}
            onChange={(event) =>
              setFields((current) => ({ ...current, categoria: event.target.value }))
            }
          >
            <option>Pre-Benjamín</option>
            <option>Benjamín</option>
            <option>Alevín</option>
            <option>Infantil</option>
            <option>Cadete</option>
            <option>Juvenil</option>
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className={labelClass}>Mensaje o comentario (opcional)</span>
          <textarea
            className={`${fieldClass} min-h-28`}
            name="mensaje"
            placeholder="Cuéntanos detalles sobre el aspirante o tus dudas."
            value={fields.mensaje}
            onChange={(event) =>
              setFields((current) => ({ ...current, mensaje: event.target.value }))
            }
          />
        </label>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-gold inline-flex min-h-12 w-full items-center justify-center rounded-lg px-5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "sending" ? "Enviando..." : "Enviar solicitud"}
        </button>
      </div>

      {status === "enviado" && (
        <p className="mt-4 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-700 dark:text-green-300">
          ¡Mensaje enviado! Te contactaremos pronto.
        </p>
      )}
      {status === "error" && (
        <div className="mt-4 space-y-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-700 dark:text-red-300">
          <p>{errorMessage || "No pudimos enviar el formulario en este momento."}</p>
          <a
            href={buildWhatsAppUrl(buildWhatsAppFallbackMessage(fields))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black text-white"
            aria-label="Enviar solicitud de inscripción por WhatsApp"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Enviar por WhatsApp
          </a>
          <p className="text-xs font-normal">
            También puedes escribirnos a {social.email}
          </p>
        </div>
      )}
    </form>
  );
}
