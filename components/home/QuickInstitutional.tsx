import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Trophy } from "lucide-react";
import { club } from "@/lib/content";

const programCards = [
  {
    title: "Escuela formativa",
    description:
      "Niños y jóvenes desarrollan técnica, coordinación, disciplina y confianza con seguimiento por categorías.",
    href: "/equipo",
    cta: "Ver categorías",
    icon: BookOpen,
  },
  {
    title: "Proceso competitivo",
    description:
      "Entrenamientos enfocados en toma de decisiones, presión, definición y comportamiento en torneo.",
    href: "/entrenamientos",
    cta: "Ver sesiones",
    icon: Trophy,
  },
  {
    title: "Acompañamiento",
    description:
      "Familias, cuerpo técnico y comunidad sostienen un entorno de respeto, pertenencia y superación.",
    href: "/club",
    cta: "Conocer club",
    icon: ShieldCheck,
  },
];

export function QuickInstitutional() {
  return (
    <section className="overflow-hidden bg-bg-elevated text-text">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-end">
          <div className="mobile-reveal">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Real Sporting de Usme
            </p>
            <h2 className="mt-5 text-[clamp(2.55rem,12vw,4.4rem)] font-black leading-[0.92] tracking-tight sm:text-6xl">
              El balón como herramienta de transformación.
            </h2>
          </div>
          <p className="mobile-reveal mobile-reveal-delay-1 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {club.history}
          </p>
        </div>

        <div className="mobile-snap-x mobile-scrollbar-none mt-12 grid gap-px overflow-hidden rounded-[1.6rem] border border-border bg-border sm:mt-14 sm:grid-cols-3 sm:rounded-lg">
          {[
            ["7", "categorías formativas"],
            ["20+", "espacios por categoría"],
            ["2026", "proyecto deportivo renovado"],
          ].map(([value, label]) => (
            <div key={label} className="mobile-card-lift bg-bg p-6 sm:p-8">
              <p className="text-5xl font-black text-accent">{value}</p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg text-text">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="mobile-reveal">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                Tres caminos
              </p>
              <h2 className="mt-4 text-[clamp(2.45rem,12vw,4.3rem)] font-black leading-[0.95] tracking-tight sm:text-6xl">
                Empieza, entrena y crece con el club.
              </h2>
              <Link
                href="/contacto"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-bg shadow-lg shadow-accent/20 transition-colors hover:bg-accent/90 sm:rounded-lg"
              >
                Solicitar inscripción
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="mobile-snap-x mobile-scrollbar-none grid gap-4">
              {programCards.map(({ title, description, href, cta, icon: Icon }) => (
                <Link
                  key={title}
                  href={href}
                  className="mobile-card-lift group grid gap-5 rounded-[1.6rem] border border-border bg-bg-elevated p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 sm:rounded-lg sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:items-center"
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-accent text-bg sm:rounded-lg">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xl font-black">{title}</span>
                    <span className="mt-2 block text-sm leading-7 text-muted">
                      {description}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-accent">
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

          <div className="mt-16 grid gap-8 sm:mt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-center">
            <div className="mobile-card-lift relative aspect-[0.9] min-h-[360px] overflow-hidden rounded-[2rem] border border-border bg-bg-elevated sm:aspect-[16/10] sm:min-h-[460px] sm:rounded-lg lg:aspect-auto">
              <Image
                src="/banner.png"
                alt="Entrenamiento de Real Sporting de Usme"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 56vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#101811]/75 via-[#101811]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 max-w-lg p-5 text-white sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                  Método formativo
                </p>
                <h3 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                  Observar, corregir, competir y volver a intentar.
                </h3>
              </div>
            </div>

            <div className="mobile-snap-x mobile-scrollbar-none grid gap-px overflow-hidden rounded-[1.6rem] border border-border bg-border sm:rounded-lg">
              {club.values.slice(0, 4).map((value, index) => (
                <article key={value.title} className="mobile-card-lift bg-bg-elevated p-6">
                  <p className="text-sm font-black text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-2xl font-black">{value.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="mobile-card-lift mt-16 rounded-[1.75rem] bg-accent p-6 text-bg sm:mt-20 sm:rounded-lg sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-bg/70">
                  &quot;Nunca caminarás solo&quot;
                </p>
                <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
                  Si hay compromiso, hay proceso. Si hay proceso, hay futuro.
                </h2>
              </div>
              <Link
                href="/equipo"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-bg px-5 text-sm font-bold text-text transition-colors hover:bg-bg/90 sm:rounded-lg"
              >
                Conoce el equipo
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
