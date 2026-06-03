import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Trophy, UsersRound } from "lucide-react";
import { ValuePillarsStrip } from "@/components/home/ValuePillarsStrip";
const institutionalIntro =
  "El Club Deportivo Real Sporting impulsa procesos formativos para niños, niñas y adolescentes de Usme, integrando metodología deportiva, acompañamiento humano y sentido de pertenencia territorial. El fútbol es nuestra plataforma para formar carácter, hábitos, liderazgo y proyecto de vida.";

const programCards = [
  {
    title: "Formación integral",
    description:
      "Técnica, coordinación, lectura del juego y hábitos de compromiso en cada categoría.",
    href: "/equipo",
    cta: "Ver categorías",
    icon: BookOpen,
  },
  {
    title: "Proceso competitivo",
    description:
      "Sesiones orientadas a decisión, presión, finalización y comportamiento en torneo.",
    href: "/entrenamientos",
    cta: "Ver entrenamientos",
    icon: Trophy,
  },
  {
    title: "Comunidad",
    description:
      "Familias, cuerpo técnico y territorio sostienen un entorno seguro e incluyente.",
    href: "/club",
    cta: "Conócenos",
    icon: UsersRound,
  },
];

export function QuickInstitutional() {
  return (
    <section className="section-band section-ambient overflow-hidden text-text">
      <div className="section-shell section-padding">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
          <div>
            <p className="eyebrow">Proyecto institucional</p>
            <h2 className="font-institutional kinetic-heading mt-5 max-w-3xl text-balance text-4xl font-black leading-[1.02] sm:text-5xl lg:text-6xl">
              Formación deportiva con método, identidad y proyección humana.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {institutionalIntro}
          </p>
        </div>
      </div>

      <div className="section-ambient bg-bg text-text">
        <div className="section-shell section-padding">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <p className="eyebrow">Ruta formativa</p>
              <h2 className="font-categories kinetic-heading mt-4 text-balance text-4xl font-black leading-[0.98] sm:text-5xl lg:text-6xl">
                Inicia, entrena y evoluciona dentro de un proceso ordenado.
              </h2>
            </div>

            <div className="grid gap-4">
              {programCards.map(({ title, description, href, cta, icon: Icon }) => (
                <Link
                  key={title}
                  href={href}
                  className="alive-card premium-card premium-card-hover group grid gap-5 p-5 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:items-center"
                >
                  <span className="grid size-14 place-items-center rounded-lg bg-accent text-[var(--button-text)]">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xl font-black">{title}</span>
                    <span className="mt-2 block text-sm leading-7 text-muted">
                      {description}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-black text-accent">
                    {cta}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-center">
            <div className="cinematic-card alive-card group relative min-h-[420px] overflow-hidden rounded-lg border border-border shadow-2xl">
              <Image
                src="/brand/gallery-team.jpg"
                alt="Equipo del Club Deportivo Real Sporting en sesión de entrenamiento"
                fill
                className="interactive-image object-cover object-center"
                sizes="(min-width: 1024px) 56vw, 100vw"
              />
              <div className="image-card-overlay absolute inset-0" />
              <div className="absolute bottom-0 left-0 max-w-lg p-6 text-white sm:p-8">
                <p className="cinematic-accent text-xs font-black uppercase tracking-normal">
                  Método formativo
                </p>
                <h3 className="font-institutional mt-4 text-balance text-3xl font-black leading-tight sm:text-4xl">
                  Evaluar, corregir, competir y evolucionar.
                </h3>
              </div>
            </div>

            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-3 py-2 text-xs font-black uppercase tracking-normal text-accent">
                <ShieldCheck size={16} aria-hidden="true" />
                Valores del proceso
              </div>
              <ValuePillarsStrip />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
