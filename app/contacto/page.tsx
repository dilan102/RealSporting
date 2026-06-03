import type { Metadata } from "next";
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  MessageCircle,
} from "lucide-react";
import { OfficialDocumentsPanel } from "@/components/contact/OfficialDocumentsPanel";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHATSAPP_URL } from "@/lib/constants";
import { pageOpenGraph } from "@/lib/site";
import { registrationSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: {
    absolute: "Inscripción | Club Deportivo Real Sporting",
  },
  description:
    "Inscríbete en el Club Deportivo Real Sporting de Usme, Bogotá. Conoce los requisitos, descarga los documentos oficiales y contáctanos directamente.",
  openGraph: pageOpenGraph(
    "Inscripción | Club Deportivo Real Sporting",
    "Inscríbete en el Club Deportivo Real Sporting de Usme, Bogotá.",
  ),
};

const requirements = [
  "Niños, niñas, adolescentes y jóvenes con interés en formarse por medio del fútbol sala.",
  "Participación activa del acudiente o cuidador en el proceso formativo.",
  "Asistencia a una evaluación inicial para identificar fortalezas, necesidades y grupo etario.",
  "Compromiso con la disciplina, el respeto, la convivencia y la cultura de paz del club.",
];

export default function ContactoPage() {
  return (
    <main className="bg-bg text-text transition-colors">
      <PageHero
        title="Inscripción"
        subtitle="Ingreso al proceso deportivo, social y formativo de Real Sporting"
        eyebrow="Contacto"
        image="/brand/hero-training.jpg"
      />

      <section className="relative overflow-hidden border-b border-[color-mix(in_srgb,var(--accent-green)_18%,var(--border))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-green)_10%,var(--bg-primary))_0%,var(--bg-primary)_52%,color-mix(in_srgb,var(--accent-gold)_10%,var(--bg-primary))_100%)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-green)_14%,transparent),transparent)]" />
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="alive-card grid gap-5 rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_22%,var(--border))] bg-bg-elevated/92 p-5 shadow-xl shadow-[color-mix(in_srgb,var(--accent-green)_14%,transparent)] backdrop-blur sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
                  Proceso de ingreso
                </p>
                <h2 className="font-institutional mt-2 text-3xl font-black tracking-normal sm:text-4xl">
                  Comienza tu camino con Real Sporting
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                  Construido desde el proyecto CDRS 2026 y el modelo de entrenamiento SCM, el proceso reúne familia, formación deportiva y acompañamiento humano.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <a
                  href="/formulario-miembros-2026"
                  className="btn-gold alive-lift inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm font-black"
                  aria-label="Ir al formulario de inscripción"
                >
                  Iniciar inscripción
                </a>
                <a
                  href="#documentos"
                  className="btn-green alive-lift inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm font-black"
                >
                  Ver documentos
                </a>
              </div>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              {registrationSteps.map((step) => (
                <article
                  key={step.step}
                  className="alive-card rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_18%,var(--border))] bg-bg-elevated/88 p-4"
                >
                  <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
                    {step.step}
                  </p>
                  <h3 className="font-training mt-2 text-xl font-black">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
                </article>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-gold)_8%,var(--bg-primary))_0%,var(--bg-primary)_42%,var(--bg-primary)_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <RevealSection>
            <SectionHeading
              eyebrow="Lista de ingreso"
              title="Requisitos e inscripción"
              description="Revisa las condiciones de ingreso y completa el formulario oficial del club cuando estés listo para iniciar el proceso."
            />
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-stretch">
              <section className="alive-card light-panel rounded-lg border border-border bg-bg-elevated p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-green)] hover:shadow-lg sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-green)] text-white">
                    <ClipboardCheck size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
                      Antes de inscribirte
                    </p>
                    <h3 className="font-institutional text-2xl font-black sm:text-3xl">Requisitos</h3>
                  </div>
                </div>
                <ul className="mt-6 space-y-3">
                  {requirements.map((item) => (
                    <li
                      key={item}
                      className="alive-lift rounded-lg border border-border bg-bg px-4 py-3 text-sm leading-relaxed text-muted transition-all duration-300 ease-in-out hover:border-[var(--accent-gold)] hover:bg-bg-elevated"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <aside className="alive-card flex flex-col justify-between rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_22%,var(--border))] bg-bg-elevated p-6 shadow-sm sm:p-8">
                <div>
                  <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
                    Formulario oficial
                  </p>
                  <h3 className="font-institutional mt-2 text-2xl font-black sm:text-3xl">
                    Información de miembros 2026
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    Registra al aspirante, datos del representante y autorizaciones en el formulario
                    institucional. El club recibe la solicitud por el canal configurado.
                  </p>
                </div>
                <div className="mt-8 flex flex-col gap-3">
                  <a
                    href="/formulario-miembros-2026"
                    className="btn-gold alive-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black"
                    aria-label="Ir al formulario de inscripción"
                  >
                    Iniciar inscripción
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <a
                    href="#documentos"
                    className="btn-green alive-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black"
                  >
                    Ver documentos
                    <FileText size={16} aria-hidden="true" />
                  </a>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="alive-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-bg px-5 text-sm font-black text-text transition-all hover:border-[var(--accent-green)]"
                  >
                    Consultar por WhatsApp
                    <MessageCircle size={16} aria-hidden="true" />
                  </a>
                </div>
              </aside>
            </div>
          </RevealSection>
        </div>
      </section>

      <section id="documentos" className="scroll-mt-28 bg-bg-elevated">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <RevealSection>
            <SectionHeading
              eyebrow="Documentación"
              title="Descargas oficiales"
              description="Consulta el modelo de entrenamiento y el proyecto deportivo institucional antes de completar el proceso."
            />
            <OfficialDocumentsPanel />
          </RevealSection>
        </div>
      </section>

      <section className="bg-bg-elevated">
        <div className="mx-auto max-w-6xl px-4 py-14 pb-24 sm:px-6 lg:px-8">
          <RevealSection>
            <SectionHeading
              eyebrow="Atención directa"
              title="Contáctenos"
              description="Escríbenos por redes, correo o teléfono si necesitas orientación antes de completar la inscripción."
            />
            <div className="mt-8">
              <SocialLinks showVenue />
            </div>
          </RevealSection>
        </div>
      </section>
    </main>
  );
}
