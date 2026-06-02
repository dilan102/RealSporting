import type { Metadata } from "next";
import {
  Brain,
  CalendarDays,
  ClipboardCheck,
  Dumbbell,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Target,
  UsersRound,
} from "lucide-react";
import { ContactFormSection } from "@/components/contact/ContactFormSection";
import { OfficialDocumentsPanel } from "@/components/contact/OfficialDocumentsPanel";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
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

const programCards = [
  {
    title: "Formación integral",
    icon: HeartHandshake,
    text: "El proyecto combina deporte y desarrollo humano para fortalecer resiliencia, comunicación, trabajo en equipo y prevención de violencia.",
  },
  {
    title: "Base territorial",
    icon: MapPin,
    text: "Las actividades se enfocan en la UPZ 61 de Usme, usando espacios comunitarios, parques y alianzas locales.",
  },
  {
    title: "Inclusión",
    icon: UsersRound,
    text: "El club prioriza oportunidades para población vulnerable, víctimas del conflicto armado, comunidades afro, indígenas y migrantes.",
  },
  {
    title: "Acompañamiento",
    icon: Target,
    text: "El proceso integra seguimiento deportivo, salud preventiva, talleres familiares, manejo emocional y fortalecimiento de autoestima.",
  },
];

const trainingModel = [
  {
    title: "Motricidad",
    icon: Brain,
    text: "Alfabetización motora, apoyos, orientación espacial, coordinación y toma de decisiones con estímulos variables.",
  },
  {
    title: "Físico",
    icon: Dumbbell,
    text: "Potencia metabólica, fuerza funcional, prevención de lesiones y sprints repetidos con transferencia inmediata al juego.",
  },
  {
    title: "Técnica-táctica",
    icon: ClipboardCheck,
    text: "Micro-situaciones de caos controlado, superioridades, finalización bajo presión y lectura del espacio en fútbol sala.",
  },
  {
    title: "Macrociclo SCM",
    icon: CalendarDays,
    text: "Plan de 8 semanas con bloques de cimentación, caos, alta intensidad y maestría competitiva.",
  },
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
            <div className="grid gap-5 rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_22%,var(--border))] bg-bg-elevated/92 p-5 shadow-xl shadow-[color-mix(in_srgb,var(--accent-green)_14%,transparent)] backdrop-blur sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
                  Proceso de ingreso
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-normal sm:text-3xl">
                  Comienza tu camino con Real Sporting
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
                  Construido desde el proyecto CDRS 2026 y el modelo de entrenamiento SCM, el proceso reúne familia, formación deportiva y acompañamiento humano.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <a
                  href="#formulario"
                  className="btn-gold inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm font-black"
                  aria-label="Ir al formulario de inscripción"
                >
                  Iniciar inscripción
                </a>
                <a
                  href="#documentos"
                  className="btn-green inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm font-black"
                >
                  Ver documentos
                </a>
              </div>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              {registrationSteps.map((step) => (
                <article
                  key={step.step}
                  className="rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_18%,var(--border))] bg-bg-elevated/88 p-4"
                >
                  <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
                    {step.step}
                  </p>
                  <h3 className="mt-2 text-lg font-black">{step.title}</h3>
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
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-start">
              <section className="light-panel rounded-lg border border-border bg-bg-elevated p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-green)] hover:shadow-lg sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-green)] text-white">
                    <ClipboardCheck size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
                      Lista de ingreso
                    </p>
                    <h2 className="text-2xl font-black">Requisitos</h2>
                  </div>
                </div>
                <ul className="mt-6 space-y-3">
                  {requirements.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg border border-border bg-bg px-4 py-3 text-sm leading-relaxed text-muted transition-all duration-300 ease-in-out hover:border-[var(--accent-gold)] hover:bg-bg-elevated"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <ContactFormSection />
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

      <section className="bg-[color-mix(in_srgb,var(--accent-green)_7%,var(--bg-primary))]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <RevealSection>
          <SectionHeading
            eyebrow="Proyecto CDRS 2026"
            title="Enfoque del programa"
            description="El club entiende el deporte como una herramienta de salud, educación, inclusión, comunidad y paz."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {programCards.map(({ title, text, icon: Icon }) => (
              <article
                key={title}
                className="light-panel rounded-lg border border-border bg-bg-elevated p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-gold)] hover:shadow-lg"
              >
                <Icon className="text-[var(--accent-green)]" size={24} aria-hidden="true" />
                <h3 className="mt-4 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </article>
            ))}
          </div>
        </RevealSection>
        </div>
      </section>

      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <RevealSection>
          <SectionHeading
            eyebrow="Modelo SCM"
            title="Cómo entrenamos"
            description="La Sinergia Cognitivo-Motriz une cuerpo, lectura del juego y valores para resolver problemas reales del fútbol sala."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trainingModel.map(({ title, text, icon: Icon }) => (
              <article
                key={title}
                className="light-panel rounded-lg border border-border bg-bg-elevated p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-green)] hover:shadow-lg"
              >
                <Icon className="text-[var(--accent-gold)]" size={24} aria-hidden="true" />
                <h3 className="mt-4 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </article>
            ))}
          </div>
        </RevealSection>
        </div>
      </section>

      <section className="bg-bg-elevated">
        <div className="mx-auto max-w-6xl px-4 py-14 pb-24 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-green)] text-white">
              <MessageCircle size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-normal text-[var(--accent-green)]">
                Atención directa
              </p>
              <h2 className="text-2xl font-black">Contáctenos</h2>
            </div>
          </div>
          <SocialLinks showVenue />
        </RevealSection>
        </div>
      </section>
    </main>
  );
}
