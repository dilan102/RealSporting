import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Shield } from "lucide-react";
import {
  OdsCommitment,
  Timeline,
  ValuesGrid,
  VisionMission,
} from "@/components/club/VisionMission";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { club } from "@/lib/content";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "El Club",
  description: `Historia, misión, visión y valores de ${club.name}.`,
  openGraph: pageOpenGraph(
    `El Club | ${club.name}`,
    `Historia, misión, visión y valores de ${club.name}.`,
  ),
};

const clubStats = [
  { value: "Usme", label: "Territorio" },
  { value: "2022", label: "Inicio del proceso" },
  { value: "7", label: "Categorías formativas" },
];

export default function ClubPage() {
  return (
    <main className="bg-bg pt-24 text-text sm:pt-28">
      <PageHero title="El Club" subtitle="Historia, misión y valores" />

      <RevealSection>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-accent">
            <Shield size={15} aria-hidden="true" />
            Institucional
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacto"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-bold text-[var(--button-text)] transition-colors hover:bg-accent/90"
            >
              Inscripción
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/equipo"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-bg px-5 text-sm font-bold text-text transition-colors hover:border-accent/50 hover:text-accent"
            >
              Ver equipo
            </Link>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">{club.history}</p>
      </section>
      </RevealSection>

      <RevealSection>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-lg border border-border bg-bg-elevated sm:grid-cols-3">
          {clubStats.map((stat) => (
            <div key={stat.label} className="mobile-card-lift border-b border-border p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
              <p className="text-3xl font-black text-accent">{stat.value}</p>
              <p className="mt-2 text-sm font-semibold text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      </RevealSection>

      <RevealSection>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
              Proyecto deportivo
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Identidad clara, metodología diaria.
            </h2>
          </div>
          <BadgeCheck className="text-accent" size={34} aria-hidden="true" />
        </div>
        <VisionMission />
        <ValuesGrid />
      </section>
      </RevealSection>

      <RevealSection>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
            Sostenibilidad
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Nuestro compromiso con el desarrollo sostenible
          </h2>
        </div>
        <OdsCommitment />
      </section>
      </RevealSection>

      <RevealSection>
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-accent">
              Historia
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Hitos del club
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Una línea de avance que refleja consolidación, aprendizaje y
              proyección institucional.
            </p>
          </div>
          <Timeline />
        </div>
      </section>
      </RevealSection>
    </main>
  );
}
