"use client";

import { FormEvent, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, FileCheck2, ShieldCheck, UserRound } from "lucide-react";
import { social } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/constants";

type MemberFormFields = {
  dataConsent: string;
  imageConsent: string;
  riskConsent: string;
  statutoryDeclaration: string;
  memberName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  address: string;
  phone: string;
  eps: string;
  shoeSize: string;
  uniformSize: string;
  populationType: string;
  representativeName: string;
  representativeId: string;
  representativePhone: string;
};

type FormStatus = "idle" | "sending" | "sent" | "error";

const initialFields: MemberFormFields = {
  dataConsent: "",
  imageConsent: "",
  riskConsent: "",
  statutoryDeclaration: "",
  memberName: "",
  documentType: "",
  documentNumber: "",
  birthDate: "",
  address: "",
  phone: "",
  eps: "",
  shoeSize: "",
  uniformSize: "",
  populationType: "",
  representativeName: "",
  representativeId: "",
  representativePhone: "",
};

const fieldClass =
  "mt-2 w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 text-sm font-semibold text-text outline-none placeholder:text-muted/60 focus:border-[var(--accent-green)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--accent-green)_16%,transparent)]";

const labelClass = "text-sm font-black text-text";

const legalSections = [
  {
    key: "dataConsent",
    title: "Autorización para tratamiento de datos personales",
    text: "Por medio del presente y de conformidad con lo dispuesto en las normas vigentes sobre protección de datos personales, en especial la Ley 1581 de 2012 y el Decreto 1074 de 2015, autorizo libre, expresa e inequívocamente al Club Deportivo Real Sporting de Usme, para que realice la recolección y tratamiento de mis datos personales que suministro de manera veraz y completa, los cuales serán utilizados para los diferentes aspectos relacionados con la gestión de recursos y el diseño de programas de apoyo integral y deportivos adaptados a la realidad de la comunidad.",
    options: ["SI", "NO"],
  },
  {
    key: "imageConsent",
    title: "Autorización para uso de imagen",
    text: "El suscrito aceptante con la firma del presente documento otorga autorización expresa del uso de los derechos de imagen que reconocen la Constitución, la ley y demás normas concordantes al Club Deportivo Real Sporting de Usme, para que haga el uso y tratamiento de mis derechos de imagen para incluirlos sobre fotografías; así como de los Derechos de Autor, y/o procedimientos análogos a la fotografía; producciones Audiovisuales (Videos) para fines internos y externos incluyendo, por ejemplo, su uso en materiales promocionales y actividades publicitarias; los Derechos Conexos y en general todos aquellos derechos de propiedad intelectual que tengan que ver con el derecho de imagen. La presente autorización de uso se otorga para ser utilizada en formato o soporte material en ediciones impresas, y se extiende a la utilización en medio electrónico, óptico, magnético, en redes (Intranet e Internet), mensajes de datos o similares y en general para cualquier medio o soporte.",
    options: ["SI", "No"],
  },
  {
    key: "riskConsent",
    title: "Consentimiento para asumir riesgo y exoneración de responsabilidad",
    text: "El suscrito aceptante ha sido asesorado e informado de las contingencias o riesgos inherentes a la práctica deportiva que desarrolla el Club Deportivo. Aun así decide proceder con la práctica deportiva, a pesar de las posibles contingencias y riesgos que puedan derivarse de la misma, y entiende y acepta que ni los profesores, ni el Club Deportivo Real Sporting de Usme, ni las instalaciones donde recibe la práctica, pueden considerarse responsables por lesión, muerte u otro tipo de daño que pudiera ocurrir como resultado de la participación en esta práctica deportiva. Además, libera al Club Deportivo Real Sporting de Usme de cualquier reclamación o juicio que surja por la inscripción y participación en esta práctica.",
    options: ["SI", "No"],
  },
  {
    key: "statutoryDeclaration",
    title: "Declaración juramentada",
    text: "Me comprometo a respetar y seguir todas las normativas y regulaciones establecidas en los estatutos del Club Deportivo Real Sporting de Usme, así como las establecidas por asamblea general de afiliados, y entiendo que cualquier incumplimiento puede resultar en la terminación de mi afiliación.",
    options: ["si", "No"],
  },
] as const;

const documentTypes = ["RC", "TI", "PPT", "CC"];
const populationTypes = [
  "Victimas del conflicto",
  "Afro",
  "Indigena",
  "Victima/Afro",
  "Vulnerable",
];

function buildMessage(fields: MemberFormFields) {
  return [
    "Información general miembros Club Deportivo Real Sporting 2026",
    "",
    "Autorizaciones",
    `Tratamiento de datos personales: ${fields.dataConsent}`,
    `Uso de imagen: ${fields.imageConsent}`,
    `Riesgo y exoneración: ${fields.riskConsent}`,
    `Declaración juramentada: ${fields.statutoryDeclaration}`,
    "",
    "Datos Miembro Club Deportivo",
    `Apellidos y Nombres del inscrito: ${fields.memberName}`,
    `Tipo de documento: ${fields.documentType}`,
    `Numero de identificación: ${fields.documentNumber}`,
    `Fecha de nacimiento: ${fields.birthDate}`,
    `Direccion: ${fields.address}`,
    `Número de Celular: ${fields.phone}`,
    `EPS: ${fields.eps}`,
    `Talla de zapatos: ${fields.shoeSize}`,
    `Talla Uniforme: ${fields.uniformSize}`,
    `Tipo de población: ${fields.populationType}`,
    "",
    "Datos del representante",
    `Nombre completo del representante: ${fields.representativeName}`,
    `Numero de identificación representante: ${fields.representativeId}`,
    `Numero de celular representante: ${fields.representativePhone}`,
  ].join("\n");
}

export function MemberInfoForm() {
  const [fields, setFields] = useState<MemberFormFields>(initialFields);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const whatsappUrl = useMemo(
    () =>
      buildWhatsAppUrl(
        [
          "Hola Real Sporting, quiero enviar la información general de miembro 2026.",
          `Inscrito: ${fields.memberName || "Sin registrar"}`,
          `Representante: ${fields.representativeName || "Sin registrar"}`,
          `Celular: ${fields.representativePhone || fields.phone || "Sin registrar"}`,
        ].join("\n"),
      ),
    [fields.memberName, fields.phone, fields.representativeName, fields.representativePhone],
  );

  const updateField = (field: keyof MemberFormFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aspirante: fields.memberName,
          edad: fields.birthDate,
          acudiente: fields.representativeName,
          telefono: fields.representativePhone || fields.phone,
          correo: social.email,
          mensaje: buildMessage(fields),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message || "No se pudo enviar el formulario.");
      }

      setStatus("sent");
      setFields(initialFields);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo enviar el formulario. Intenta nuevamente.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="alive-card light-panel rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_22%,var(--border))] bg-bg-elevated p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3 border-b border-border pb-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--accent-green)] text-white">
            <ShieldCheck size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
              Autorizaciones
            </p>
            <h2 className="font-institutional text-3xl font-black">Consentimientos iniciales</h2>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {legalSections.map((section) => (
            <fieldset key={section.key} className="alive-card rounded-lg border border-border bg-bg p-4">
              <legend className="font-institutional px-1 text-base font-black text-text">{section.title}</legend>
              <p className="mt-3 text-sm leading-7 text-muted">{section.text}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {section.options.map((option) => (
                  <label
                    key={option}
                    className="alive-lift inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 text-sm font-black text-text"
                  >
                    <input
                      required
                      type="radio"
                      name={section.key}
                      value={option}
                      checked={fields[section.key] === option}
                      onChange={(event) => updateField(section.key, event.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      <section className="alive-card light-panel rounded-lg border border-border bg-bg-elevated p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3 border-b border-border pb-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--accent-gold)] text-[var(--button-text)]">
            <UserRound size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
              Datos Miembro Club Deportivo
            </p>
            <h2 className="font-categories text-4xl font-black leading-none">Información del inscrito</h2>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelClass}>Apellidos y Nombres del inscrito (Mayuscula)</span>
            <input
              required
              className={fieldClass}
              value={fields.memberName}
              onChange={(event) => updateField("memberName", event.target.value)}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Tipo de documento</span>
            <select
              required
              className={fieldClass}
              value={fields.documentType}
              onChange={(event) => updateField("documentType", event.target.value)}
            >
              <option value="">Selecciona una opción</option>
              {documentTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelClass}>Numero de identificación</span>
            <input
              required
              className={fieldClass}
              value={fields.documentNumber}
              onChange={(event) => updateField("documentNumber", event.target.value)}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Fecha de nacimiento</span>
            <input
              required
              className={fieldClass}
              type="date"
              value={fields.birthDate}
              onChange={(event) => updateField("birthDate", event.target.value)}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Direccion</span>
            <input
              required
              className={fieldClass}
              value={fields.address}
              onChange={(event) => updateField("address", event.target.value)}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Número de Celular</span>
            <input
              required
              className={fieldClass}
              type="tel"
              value={fields.phone}
              onChange={(event) => updateField("phone", event.target.value)}
            />
          </label>

          <label className="block">
            <span className={labelClass}>EPS</span>
            <input
              required
              className={fieldClass}
              value={fields.eps}
              onChange={(event) => updateField("eps", event.target.value)}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Talla de zapatos</span>
            <input
              required
              className={fieldClass}
              value={fields.shoeSize}
              onChange={(event) => updateField("shoeSize", event.target.value)}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Talla Uniforme</span>
            <input
              required
              className={fieldClass}
              value={fields.uniformSize}
              onChange={(event) => updateField("uniformSize", event.target.value)}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className={labelClass}>Tipo de población</span>
            <select
              required
              className={fieldClass}
              value={fields.populationType}
              onChange={(event) => updateField("populationType", event.target.value)}
            >
              <option value="">Selecciona una opción</option>
              {populationTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="alive-card light-panel rounded-lg border border-border bg-bg-elevated p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3 border-b border-border pb-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--accent-green)] text-white">
            <FileCheck2 size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
              Datos del representante
            </p>
            <h2 className="font-social-impact text-2xl font-black">Responsable mayor de edad</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              El representante debe ser un mayor de edad, responsable de novedades, acompañamiento y pagos de matriculas, inscripciones a torneos y mensualidades.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={labelClass}>Nombre completo del representante</span>
            <input
              required
              className={fieldClass}
              value={fields.representativeName}
              onChange={(event) => updateField("representativeName", event.target.value)}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Numero de identificación representante</span>
            <input
              required
              className={fieldClass}
              value={fields.representativeId}
              onChange={(event) => updateField("representativeId", event.target.value)}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Numero de celular</span>
            <input
              required
              className={fieldClass}
              type="tel"
              value={fields.representativePhone}
              onChange={(event) => updateField("representativePhone", event.target.value)}
            />
          </label>
        </div>
      </section>

      <div className="alive-card rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_22%,var(--border))] bg-bg-elevated p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div className="flex items-start gap-3">
          <CalendarDays className="mt-0.5 shrink-0 text-[var(--accent-green)]" size={20} aria-hidden="true" />
          <p className="text-sm font-semibold leading-6 text-muted">
            Este formulario estará habilitado desde el día 01 de enero de 2026.
          </p>
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-gold alive-lift mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-6 text-sm font-black disabled:cursor-not-allowed disabled:opacity-70 sm:mt-0 sm:w-auto"
        >
          <CheckCircle2 size={18} aria-hidden="true" />
          {status === "sending" ? "Enviando..." : "Enviar formulario"}
        </button>
      </div>

      {status === "sent" && (
        <p className="rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-700 dark:text-green-300">
          Formulario enviado correctamente. El club recibió la información.
        </p>
      )}

      {status === "error" && (
        <div className="space-y-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-700 dark:text-red-300">
          <p>{errorMessage}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-black text-white"
          >
            Enviar aviso por WhatsApp
          </a>
        </div>
      )}
    </form>
  );
}
