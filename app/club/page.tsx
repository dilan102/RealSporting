import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Shield } from "lucide-react";
import {
  Timeline,
  ValuesGrid,
  VisionMission,
} from "@/components/club/VisionMission";
import { RevealSection } from "@/components/ui/RevealSection";
import { club } from "@/lib/content";

export const metadata: Metadata = {
  title: "El Club",
  description: `Historia, misión, visión y valores de ${club.name}.`,
};

const clubStats = [
  { value: "Usme", label: "Territorio" },
  { value: "2022", label: "Inicio del proceso" },
  { value: "7", label: "Categorías formativas" },
];

export default function ClubPage() {
  return (
    <main className="bg-bg pt-24 text-text">
      <RevealSection>
        <section className="relative overflow-hidden border-b border-border bg-bg-elevated">
          <div className="pointer-events-none absolute inset-0 grid-overlay opacity-60" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] lg:items-center lg:px-8">
          <div className="mobile-reveal relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-accent backdrop-blur-md sm:rounded-lg">
              <Shield size={15} aria-hidden="true" />
              Institucional
            </p>
            <h1 className="mt-6 text-[clamp(2.8rem,14vw,4.6rem)] font-black leading-[0.92] tracking-tight sm:text-6xl">
              Un club para crecer con el barrio.
            </h1>
            <p className="mobile-reveal mobile-reveal-delay-1 mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              {club.history}
            </p>
            <div className="mobile-reveal mobile-reveal-delay-2 mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/contacto"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-bg transition-colors hover:bg-accent/90 sm:rounded-lg"
              >
                Inscripción
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/equipo"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-bg px-5 text-sm font-bold text-text transition-colors hover:border-accent/50 hover:text-accent sm:rounded-lg"
              >
                Ver equipo
              </Link>
            </div>
          </div>

          <div className="relative aspect-[16/10] min-h-[230px] overflow-hidden rounded-lg border border-border bg-bg shadow-xl sm:min-h-[360px] lg:aspect-auto lg:min-h-[520px]">
            <Image
              src="/banner.png"
              alt={`Jugadores de ${club.name}`}
              fill
              priority
              className="object-cover object-center"
              sizes="(min-width: 1024px) 52vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-accent">
                <MapPin size={15} aria-hidden="true" />
                Usme · Bogotá
              </p>
              <p className="mt-3 max-w-md text-2xl font-black leading-tight">
                Nunca caminarás solo.
              </p>
            </div>
          </div>
        </div>
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
              Identidad clara, trabajo diario.
            </h2>
          </div>
          <BadgeCheck className="text-accent" size={34} aria-hidden="true" />
        </div>
        <VisionMission />
        <ValuesGrid />
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
              Un recorrido sencillo para ubicar el crecimiento del proceso.
            </p>
          </div>
          <Timeline />
        </div>
      </section>
      </RevealSection>
    </main>
  );
}
