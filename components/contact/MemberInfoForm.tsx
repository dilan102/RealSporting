"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
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
type QuestionKind = "radio" | "text" | "select" | "date" | "tel" | "number";

type QuestionDefinition = {
  key: keyof MemberFormFields;
  title: string;
  description?: string;
  kind: QuestionKind;
  options?: string[];
  placeholder?: string;
  example?: string;
};

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

const documentTypes = ["RC", "TI", "PPT", "CC"];
const populationTypes = [
  "Victimas del conflicto",
  "Afro",
  "Indigena",
  "Victima/Afro",
  "Vulnerable",
];

const questions: QuestionDefinition[] = [
  {
    key: "dataConsent",
    title: "Autorización para tratamiento de datos personales",
    description:
      "Acepta que el club use y gestione sus datos personales para la inscripción y acompañamiento del proceso deportivo.",
    kind: "radio",
    options: ["SI", "NO"],
    example: "SI",
  },
  {
    key: "imageConsent",
    title: "Autorización para uso de imagen",
    description:
      "Autoriza que el club pueda usar su imagen en materiales institucionales y actividades deportivas.",
    kind: "radio",
    options: ["SI", "NO"],
    example: "SI",
  },
  {
    key: "riskConsent",
    title: "Consentimiento para asumir riesgo",
    description:
      "Reconoce que la práctica deportiva implica riesgos y acepta las condiciones del club.",
    kind: "radio",
    options: ["SI", "NO"],
    example: "SI",
  },
  {
    key: "statutoryDeclaration",
    title: "Declaración juramentada",
    description:
      "Confirma que cumplirá con las normas del club y acepta el compromiso institucional.",
    kind: "radio",
    options: ["SI", "NO"],
    example: "SI",
  },
  {
    key: "memberName",
    title: "Apellidos y nombres del inscrito",
    description: "Escriba el nombre completo con letras y espacios.",
    kind: "text",
    placeholder: "Juan Andrés Pérez",
    example: "Juan Andrés Pérez",
  },
  {
    key: "documentType",
    title: "Tipo de documento",
    description: "Seleccione el tipo de documento que corresponde al inscrito.",
    kind: "select",
    options: documentTypes,
    example: "CC",
  },
  {
    key: "documentNumber",
    title: "Número de identificación",
    description: "Ingrese solo números, sin puntos ni espacios.",
    kind: "number",
    placeholder: "1023456789",
    example: "1023456789",
  },
  {
    key: "birthDate",
    title: "Fecha de nacimiento",
    description: "Seleccione la fecha desde el calendario.",
    kind: "date",
    example: "2008-05-14",
  },
  {
    key: "address",
    title: "Dirección",
    description: "Ingrese una dirección completa y válida.",
    kind: "text",
    placeholder: "Calle 12 #34-56",
    example: "Calle 12 #34-56",
  },
  {
    key: "phone",
    title: "Número de celular",
    description: "Ingrese solo números y el prefijo internacional si aplica.",
    kind: "tel",
    placeholder: "+573209059855",
    example: "+573209059855",
  },
  {
    key: "eps",
    title: "EPS",
    description: "Escriba el nombre de la EPS del inscrito.",
    kind: "text",
    placeholder: "EPS Sanitas",
    example: "EPS Sanitas",
  },
  {
    key: "shoeSize",
    title: "Talla de zapatos",
    description: "Ingrese solo un número de talla válido.",
    kind: "number",
    placeholder: "38",
    example: "38",
  },
  {
    key: "uniformSize",
    title: "Talla de uniforme",
    description: "Seleccione la talla del uniforme.",
    kind: "select",
    options: ["S", "M", "L", "XL", "XXL"],
    example: "M",
  },
  {
    key: "populationType",
    title: "Tipo de población",
    description: "Seleccione la opción que corresponde al inscrito.",
    kind: "select",
    options: populationTypes,
    example: "Vulnerable",
  },
  {
    key: "representativeName",
    title: "Nombre completo del representante",
    description: "Escriba el nombre completo del responsable mayor de edad.",
    kind: "text",
    placeholder: "Ana María Pérez",
    example: "Ana María Pérez",
  },
  {
    key: "representativeId",
    title: "Número de identificación del representante",
    description: "Ingrese solo números, sin puntos ni espacios.",
    kind: "number",
    placeholder: "1023456789",
    example: "1023456789",
  },
  {
    key: "representativePhone",
    title: "Número de celular del representante",
    description: "Ingrese solo números y el prefijo internacional si aplica.",
    kind: "tel",
    placeholder: "+573209059855",
    example: "+573209059855",
  },
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
  const [currentStep, setCurrentStep] = useState(0);
  const [validationMessage, setValidationMessage] = useState("");

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
    [
      fields.memberName,
      fields.phone,
      fields.representativeName,
      fields.representativePhone,
    ],
  );

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;

  const updateField = (field: keyof MemberFormFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setValidationMessage("");
  };

  const validateCurrentField = () => {
    const rawValue = (fields[currentQuestion.key] ?? "").trim();

    if (currentQuestion.kind === "radio") {
      if (!rawValue) {
        setValidationMessage(
          "Tipo de dato incorrecto. Ingrese un dato válido.",
        );
        return false;
      }

      const normalized = rawValue.toUpperCase();
      if (normalized === "NO") {
        setValidationMessage(
          "No puede continuar su proceso de inscripción si no acepta los términos y condiciones.",
        );
        return false;
      }

      if (normalized !== "SI") {
        setValidationMessage(
          `Tipo de dato incorrecto. Ingrese un dato válido, por ejemplo: ${currentQuestion.example}`,
        );
        return false;
      }

      return true;
    }

    if (!rawValue) {
      setValidationMessage("Tipo de dato incorrecto. Ingrese un dato válido.");
      return false;
    }

    switch (currentQuestion.key) {
      case "memberName":
      case "representativeName":
      case "eps": {
        const namePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
        if (!namePattern.test(rawValue)) {
          setValidationMessage(
            `Tipo de dato incorrecto. Ingrese un dato válido, por ejemplo: ${currentQuestion.example}`,
          );
          return false;
        }
        return true;
      }
      case "documentNumber":
      case "representativeId": {
        if (!/^\d{5,15}$/.test(rawValue)) {
          setValidationMessage(
            `Tipo de dato incorrecto. Ingrese un dato válido, por ejemplo: ${currentQuestion.example}`,
          );
          return false;
        }
        return true;
      }
      case "birthDate": {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(rawValue)) {
          setValidationMessage(
            `Tipo de dato incorrecto. Ingrese un dato válido, por ejemplo: ${currentQuestion.example}`,
          );
          return false;
        }
        return true;
      }
      case "phone":
      case "representativePhone": {
        if (!/^\+?\d{7,15}$/.test(rawValue.replace(/\s/g, ""))) {
          setValidationMessage(
            `Tipo de dato incorrecto. Ingrese un dato válido, por ejemplo: ${currentQuestion.example}`,
          );
          return false;
        }
        return true;
      }
      case "shoeSize": {
        const size = Number(rawValue);
        if (!/^\d{1,2}$/.test(rawValue) || size < 20 || size > 50) {
          setValidationMessage(
            `Tipo de dato incorrecto. Ingrese un dato válido, por ejemplo: ${currentQuestion.example}`,
          );
          return false;
        }
        return true;
      }
      default: {
        if (!rawValue) {
          setValidationMessage(
            `Tipo de dato incorrecto. Ingrese un dato válido, por ejemplo: ${currentQuestion.example}`,
          );
          return false;
        }
        return true;
      }
    }
  };

  const handleNext = () => {
    if (!validateCurrentField()) {
      return;
    }

    setValidationMessage("");
    setCurrentStep((current) => Math.min(current + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    setValidationMessage("");
    setCurrentStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateCurrentField()) {
      return;
    }

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
          datos: {
            dataConsent: fields.dataConsent,
            imageConsent: fields.imageConsent,
            riskConsent: fields.riskConsent,
            statutoryDeclaration: fields.statutoryDeclaration,
            memberName: fields.memberName,
            documentType: fields.documentType,
            documentNumber: fields.documentNumber,
            birthDate: fields.birthDate,
            address: fields.address,
            phone: fields.phone,
            eps: fields.eps,
            shoeSize: fields.shoeSize,
            uniformSize: fields.uniformSize,
            populationType: fields.populationType,
            representativeName: fields.representativeName,
            representativeId: fields.representativeId,
            representativePhone: fields.representativePhone,
          },
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(payload?.message || "No se pudo enviar el formulario.");
      }

      setStatus("sent");
      setFields(initialFields);
      setCurrentStep(0);
      setValidationMessage("");
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
              Proceso paso a paso
            </p>
            <h2 className="font-institutional text-3xl font-black">
              Inscripción guiada
            </h2>
            <p className="mt-2 text-sm text-muted">
              Responda cada pregunta para avanzar. Si una respuesta no es
              válida, el sistema le indicará cómo corregirla.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-normal text-muted">
            <span>
              Paso {currentStep + 1} de {questions.length}
            </span>
            <span>
              {Math.round(((currentStep + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-border">
            <div
              className="h-2 rounded-full bg-[var(--accent-green)] transition-all"
              style={{
                width: `${((currentStep + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-bg p-4">
          <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
            Pregunta actual
          </p>
          <h3 className="font-institutional mt-2 text-2xl font-black">
            {currentQuestion.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted">
            {currentQuestion.description}
          </p>

          {currentQuestion.kind === "radio" && (
            <div className="mt-5 flex flex-wrap gap-3">
              {currentQuestion.options?.map((option) => (
                <label
                  key={option}
                  className="alive-lift inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 text-sm font-black text-text"
                >
                  <input
                    type="radio"
                    name={currentQuestion.key}
                    value={option}
                    checked={fields[currentQuestion.key] === option}
                    onChange={(event) =>
                      updateField(currentQuestion.key, event.target.value)
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          {currentQuestion.kind === "select" && (
            <div className="mt-5">
              <select
                className={fieldClass}
                value={fields[currentQuestion.key]}
                onChange={(event) =>
                  updateField(currentQuestion.key, event.target.value)
                }
              >
                <option value="">Selecciona una opción</option>
                {currentQuestion.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(currentQuestion.kind === "text" ||
            currentQuestion.kind === "tel" ||
            currentQuestion.kind === "number") && (
            <div className="mt-5">
              <input
                className={fieldClass}
                type={
                  currentQuestion.kind === "number"
                    ? "number"
                    : currentQuestion.kind === "tel"
                      ? "tel"
                      : "text"
                }
                inputMode={
                  currentQuestion.kind === "number"
                    ? "numeric"
                    : currentQuestion.kind === "tel"
                      ? "tel"
                      : "text"
                }
                placeholder={currentQuestion.placeholder}
                value={fields[currentQuestion.key]}
                onChange={(event) =>
                  updateField(currentQuestion.key, event.target.value)
                }
              />
            </div>
          )}

          {currentQuestion.kind === "date" && (
            <div className="mt-5">
              <input
                className={fieldClass}
                type="date"
                value={fields[currentQuestion.key]}
                onChange={(event) =>
                  updateField(currentQuestion.key, event.target.value)
                }
              />
            </div>
          )}

          {validationMessage && (
            <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-700 dark:text-red-300">
              {validationMessage}
            </p>
          )}

          {currentQuestion.example && !validationMessage && (
            <p className="mt-3 text-sm text-muted">
              Ejemplo:{" "}
              <span className="font-semibold text-text">
                {currentQuestion.example}
              </span>
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0 || status === "sending"}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 text-sm font-black text-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Anterior
          </button>

          {isLastStep ? (
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-gold inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              <CheckCircle2 size={18} aria-hidden="true" />
              {status === "sending" ? "Enviando..." : "Enviar formulario"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="btn-gold inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black"
            >
              Siguiente
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </section>

      <section className="alive-card light-panel rounded-lg border border-border bg-bg-elevated p-5 shadow-sm sm:p-7">
        <div className="flex items-start gap-3 border-b border-border pb-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--accent-gold)] text-[var(--button-text)]">
            <UserRound size={22} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
              Resumen del proceso
            </p>
            <h2 className="font-categories text-4xl font-black leading-none">
              Información recopilada
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              El representante debe ser un mayor de edad, responsable de
              novedades, acompañamiento y pagos de matrículas, inscripciones a
              torneos y mensualidades.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-bg p-3">
            <p className="text-xs font-black uppercase tracking-normal text-muted">
              Inscrito
            </p>
            <p className="mt-2 font-semibold text-text">
              {fields.memberName || "Pendiente"}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-bg p-3">
            <p className="text-xs font-black uppercase tracking-normal text-muted">
              Representante
            </p>
            <p className="mt-2 font-semibold text-text">
              {fields.representativeName || "Pendiente"}
            </p>
          </div>
        </div>
      </section>

      <div className="alive-card rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_22%,var(--border))] bg-bg-elevated p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div className="flex items-start gap-3">
          <CalendarDays
            className="mt-0.5 shrink-0 text-[var(--accent-green)]"
            size={20}
            aria-hidden="true"
          />
          <p className="text-sm font-semibold leading-6 text-muted">
            Este formulario estará habilitado desde el día 01 de enero de 2026.
          </p>
        </div>
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
