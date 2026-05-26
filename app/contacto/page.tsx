import type { Metadata } from "next";
import {
  Brain,
  CalendarDays,
  ClipboardCheck,
  Download,
  Dumbbell,
  FileText,
  HeartHandshake,
  MapPin,
  MessageCircle,
  Target,
  UsersRound,
} from "lucide-react";
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
    <div className="bg-bg pt-24 text-text transition-colors sm:pt-28">
      <RevealSection>
      <section className="relative overflow-hidden border-b border-border bg-bg-elevated">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Proceso de ingreso"
          title="Inscripción"
          description="Ingreso al proceso deportivo, social y formativo del Club Deportivo Real Sporting, construido desde el proyecto CDRS 2026 y el modelo de entrenamiento SCM."
          align="center"
        />
        </div>
      </section>
      </RevealSection>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <RevealSection>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <section className="mobile-card-lift rounded-lg border border-border bg-bg-elevated p-6 transition-colors sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                <ClipboardCheck size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-secondary">
                  Sección
                </p>
                <h3 className="text-xl font-bold">Requisitos</h3>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {requirements.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-border bg-bg/50 px-4 py-3 text-sm leading-relaxed text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mobile-card-lift rounded-lg border border-border bg-bg-elevated p-6 transition-colors sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                <FileText size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-secondary">
                  Sección
                </p>
                <h3 className="text-xl font-bold">Papeles</h3>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {documents.map((document) => (
                <a
                  key={document.href}
                  href={document.href}
                  download
                  className="flex items-start gap-3 rounded-lg border border-border bg-bg/55 p-4 text-left transition-colors hover:border-accent/40"
                >
                  <Download
                    className="mt-0.5 shrink-0 text-accent"
                    size={18}
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-text">
                      {document.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">
                      {document.description}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        </div>
        </RevealSection>

        <RevealSection>
        <section className="mt-12">
          <SectionHeading
            eyebrow="Proyecto CDRS 2026"
            title="Enfoque del programa"
            description="El club entiende el deporte como una herramienta de salud, educación, inclusión, comunidad y paz."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {programCards.map(({ title, text, icon: Icon }) => (
              <article
                key={title}
                className="mobile-card-lift rounded-lg border border-border bg-bg-elevated p-5 transition-colors hover:border-accent/30"
              >
                <Icon className="text-accent" size={22} aria-hidden="true" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </article>
            ))}
          </div>
        </section>
        </RevealSection>

        <RevealSection>
        <section className="mt-12">
          <SectionHeading
            eyebrow="Modelo SCM"
            title="Cómo entrenamos"
            description="La Sinergia Cognitivo-Motriz une cuerpo, lectura del juego y valores para resolver problemas reales del fútbol sala."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trainingModel.map(({ title, text, icon: Icon }) => (
              <article
                key={title}
                className="mobile-card-lift rounded-lg border border-border bg-bg-elevated p-5 transition-colors hover:border-accent/30"
              >
                <Icon className="text-accent" size={22} aria-hidden="true" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </article>
            ))}
          </div>
        </section>
        </RevealSection>

        <RevealSection>
        <section className="mt-12">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
              <MessageCircle size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-secondary">
                Sección
              </p>
              <h3 className="text-xl font-bold">Contáctenos</h3>
            </div>
          </div>
          <SocialLinks />

          <div className="mobile-card-lift mx-auto mt-8 max-w-xl rounded-lg border border-border bg-bg-elevated p-8 text-center transition-colors">
            <MapPin className="mx-auto text-accent" size={28} />
            <p className="mt-4 font-semibold">Sede</p>
            <p className="mt-2 text-sm text-muted">{social.location}</p>
          </div>
        </section>
        </RevealSection>
      </section>
    </div>
  );
}
