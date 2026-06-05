import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Shield } from "lucide-react";
import { OdsCommitment } from "@/components/club/OdsCommitment";
import { Timeline, ValuesGrid, VisionMission } from "@/components/club/VisionMission";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { club, institutionalStats } from "@/lib/content";
import { contentOverride, readContentOverrides } from "@/lib/content-overrides";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conócenos",
  description: `Conoce la historia, misión, visión, valores e hitos de ${club.name} en Usme, Bogotá.`,
  openGraph: pageOpenGraph(
    `Conócenos | ${club.name}`,
    `Historia, misión, visión y valores de ${club.name}.`,
  ),
};

export const dynamic = "force-dynamic";

export default async function ClubPage() {
  const overrides = await readContentOverrides();

  return (
    <main className="bg-bg text-text">
      <PageHero
        title={contentOverride(overrides, "club.hero.title", "Conócenos")}
        subtitle={contentOverride(
          overrides,
          "club.hero.subtitle",
          "Historia, identidad, valores y el camino que recorremos como club formativo en Usme.",
        )}
        eyebrow={contentOverride(overrides, "club.hero.eyebrow", "Institucional")}
      />

      <RevealSection>
      <section className="section-shell py-12 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-black uppercase tracking-normal text-accent">
            <Shield size={15} aria-hidden="true" />
            Quiénes somos
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
        <div className="mt-8 max-w-4xl">
          <h2 className="font-institutional text-3xl font-black tracking-normal sm:text-4xl">
            Un club que forma desde el territorio
          </h2>
          <p className="mt-5 text-base leading-8 text-text sm:text-lg">{club.about.lead}</p>
          <div className="mt-6 space-y-4">
            {club.about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-sm leading-7 text-muted sm:text-base sm:leading-8">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
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
      <section id="compromiso-ods" className="section-shell scroll-mt-28 py-12 sm:py-16">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-normal text-accent">
            Sostenibilidad
          </p>
          <h2 className="font-social-impact mt-2 text-3xl font-black tracking-normal sm:text-4xl">
            Nuestro compromiso con el desarrollo sostenible
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Cada objetivo se presenta con enfoque institucional alineado a Naciones Unidas: color
            oficial del ODS, acciones del club, impacto esperado e infografía de apoyo.
          </p>
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
            <p className="mt-4 text-sm leading-7 text-muted sm:text-base sm:leading-8">
              Desde el arranque en 2022 hasta la renovación del proyecto 2026, cada etapa
              refleja crecimiento deportivo, organización por categorías y compromiso con las
              familias de Usme.
            </p>
          </div>
          <Timeline />
        </div>
      </section>
      </RevealSection>
    </main>
  );
}
