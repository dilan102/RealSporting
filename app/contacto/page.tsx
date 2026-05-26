import type { Metadata } from "next";
import {
  Brain,
  CalendarDays,
  ClipboardCheck,
  Download,
  Dumbbell,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Target,
  UsersRound,
} from "lucide-react";
import { RegistrationForm } from "@/components/contact/RegistrationForm";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { club, social } from "@/lib/content";

export const metadata: Metadata = {
  title: "Inscripción",
  description: `Información de inscripción, requisitos y contacto de ${club.name}.`,
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

const documents = [
  {
    title: "Modelo de Entrenamiento Deportivo SCM",
    description:
      "Metodología Sinergia Cognitivo-Motriz, sesión tipo, pilares de trabajo y macrociclo de 8 semanas.",
    href: "/MODELO%20DE%20ENTRENAMIENTO%20DEPORTIVO%20SCM.pdf",
  },
  {
    title: "Proyecto Deportivo CDRS 2026",
    description:
      "Proyecto social, misión, visión, objetivos ODS, metodología por edades y plan de trabajo deportivo.",
    href: "/Proyecto%20Deportivo%20CDRS%202026.docx",
  },
];

export default function ContactoPage() {
  return (
    <div className="bg-white pt-24 text-zinc-900 transition-colors sm:pt-28">
      <RevealSection>
        <section className="relative overflow-hidden border-b border-[color-mix(in_srgb,var(--accent-green)_18%,var(--border))] bg-[linear-gradient(135deg,#ffffff_0%,#f3f8f5_56%,#fff7d7_100%)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,var(--accent-green),var(--accent-gold),#0a0a0a)]" />
          <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)] lg:items-center lg:px-8 lg:py-16">
            <div>
              <p className="mb-3 inline-flex rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_22%,transparent)] bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--accent-green)] shadow-sm">
                Proceso de ingreso
              </p>
              <h1 className="text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
                Inscripción Real Sporting
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-700 sm:text-lg">
                Ingreso al proceso deportivo, social y formativo del Club Deportivo Real Sporting, construido desde el proyecto CDRS 2026 y el modelo de entrenamiento SCM.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#formulario-inscripcion"
                  className="btn-gold inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm font-black"
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
            <div className="rounded-lg border border-[color-mix(in_srgb,var(--accent-green)_22%,var(--border))] bg-[var(--accent-green)] p-6 text-white shadow-xl sm:p-8">
              <ClipboardCheck size={34} aria-hidden="true" className="text-[var(--accent-gold)]" />
              <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-white/72">
                Formación deportiva integral
              </p>
              <p className="mt-3 text-3xl font-black leading-tight">
                Futbol sala, valores, disciplina y comunidad desde Usme.
              </p>
            </div>
          </div>
        </section>
      </RevealSection>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <RevealSection>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(380px,1.1fr)] lg:items-start">
              <section className="rounded-lg border border-border bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-green)] hover:shadow-lg sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-green)] text-white">
                    <ClipboardCheck size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent-green)]">
                      Lista de ingreso
                    </p>
                    <h2 className="text-2xl font-black">Requisitos</h2>
                  </div>
                </div>
                <ul className="mt-6 space-y-3">
                  {requirements.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-700 transition-all duration-300 ease-in-out hover:border-[var(--accent-gold)] hover:bg-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section id="formulario-inscripcion" className="scroll-mt-28">
                <RegistrationForm />
              </section>
            </div>
          </RevealSection>
        </div>
      </section>

      <section id="documentos" className="scroll-mt-28 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <RevealSection>
            <SectionHeading
              eyebrow="Documentación"
              title="Descargas oficiales"
              description="Consulta el modelo de entrenamiento y el proyecto deportivo institucional antes de completar el proceso."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {documents.map((document) => (
                <a
                  key={document.href}
                  href={document.href}
                  download
                  className="group flex min-h-48 flex-col justify-between rounded-lg border border-border bg-white p-6 text-zinc-900 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-gold)] hover:shadow-lg sm:p-7"
                >
                  <span className="grid size-12 place-items-center rounded-lg bg-[var(--accent-green)] text-white transition-all duration-300 ease-in-out group-hover:bg-[var(--accent-gold)] group-hover:text-zinc-950">
                    <Download size={24} aria-hidden="true" />
                  </span>
                  <span className="mt-7 block">
                    <span className="block text-xl font-black">{document.title}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-zinc-600">
                      {document.description}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="bg-[color-mix(in_srgb,var(--accent-green)_7%,white)]">
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
                className="rounded-lg border border-border bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-gold)] hover:shadow-lg"
              >
                <Icon className="text-[var(--accent-green)]" size={24} aria-hidden="true" />
                <h3 className="mt-4 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
              </article>
            ))}
          </div>
        </RevealSection>
        </div>
      </section>

      <section className="bg-white">
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
                className="rounded-lg border border-border bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-green)] hover:shadow-lg"
              >
                <Icon className="text-[var(--accent-gold)]" size={24} aria-hidden="true" />
                <h3 className="mt-4 font-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{text}</p>
              </article>
            ))}
          </div>
        </RevealSection>
        </div>
      </section>

      <section className="bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-14 pb-24 sm:px-6 lg:px-8">
        <RevealSection>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--accent-green)] text-white">
              <MessageCircle size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent-green)]">
                Atención directa
              </p>
              <h2 className="text-2xl font-black">Contáctenos</h2>
            </div>
          </div>
          <SocialLinks />

          <div className="mx-auto mt-8 max-w-xl rounded-lg border border-border bg-white p-8 text-center shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[var(--accent-gold)] hover:shadow-lg">
            <MapPin className="mx-auto text-[var(--accent-green)]" size={28} />
            <p className="mt-4 font-black text-zinc-900">Sede</p>
            <p className="mt-2 text-sm text-zinc-600">{social.location}</p>
          </div>
        </RevealSection>
        </div>
      </section>
    </div>
  );
}
