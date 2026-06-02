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
import { club, institutionalStats } from "@/lib/content";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "El Club",
  description: `Historia, misión, visión y valores de ${club.name}.`,
  openGraph: pageOpenGraph(
    `El Club | ${club.name}`,
    `Historia, misión, visión y valores de ${club.name}.`,
  ),
};

export default function ClubPage() {
  return (
    <main className="bg-bg text-text">
      <PageHero
        title="El Club"
        subtitle="Historia, misión, visión y valores del proyecto deportivo en Usme."
        eyebrow="Institucional"
        image="/brand/gallery-team.jpg"
      />

      <RevealSection>
      <section className="section-shell py-12 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-black uppercase tracking-normal text-accent">
            <Shield size={15} aria-hidden="true" />
            Institucional
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/formulario-miembros-2026"
              className="btn-gold alive-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black"
            >
              Inscripción
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/equipo"
              className="alive-lift inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-5 text-sm font-black text-text transition-colors hover:border-accent/50 hover:text-accent"
            >
              Ver equipo
            </Link>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">{club.history}</p>
      </section>
      </RevealSection>

      <RevealSection>
      <section className="section-shell pb-10">
        <div className="grid overflow-hidden rounded-lg border border-border bg-bg-elevated sm:grid-cols-2 lg:grid-cols-4">
          {institutionalStats.map((stat) => (
            <div key={stat.label} className="alive-card border-b border-border p-6 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0">
              <p className="font-training text-4xl font-black text-accent">{stat.value}</p>
              <p className="mt-2 text-sm font-black">{stat.label}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>
      </RevealSection>

      <RevealSection>
      <section className="section-shell py-12 sm:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-accent">
              Proyecto deportivo
            </p>
            <h2 className="font-institutional mt-2 text-3xl font-black tracking-normal sm:text-5xl">
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
      <section className="section-shell py-12 sm:py-16">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-normal text-accent">
            Sostenibilidad
          </p>
          <h2 className="font-social-impact mt-2 text-3xl font-black tracking-normal sm:text-4xl">
            Nuestro compromiso con el desarrollo sostenible
          </h2>
        </div>
        <OdsCommitment />
      </section>
      </RevealSection>

      <RevealSection>
      <section className="section-shell pb-24 pt-12 sm:pt-16">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div>
            <p className="text-xs font-black uppercase tracking-normal text-accent">
              Historia
            </p>
            <h2 className="font-institutional mt-2 text-4xl font-black tracking-normal">
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
