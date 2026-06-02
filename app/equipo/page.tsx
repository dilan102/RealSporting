import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PlayerManager } from "@/components/equipo/PlayerManager";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { club, sportCategoryCards } from "@/lib/content";
import { readPlayers } from "@/lib/player-store";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Equipo",
  description: `Plantilla y jugadores de ${club.name}.`,
  openGraph: pageOpenGraph(
    `Equipo | ${club.name}`,
    `Plantilla y jugadores de ${club.name}.`,
  ),
};

export const dynamic = "force-dynamic";

export default async function EquipoPage() {
  const players = await readPlayers();

  return (
    <main className="bg-bg text-text">
      <PageHero
        title="Categorías"
        subtitle="Rangos formativos, convocatorias y registro deportivo del proceso 2026."
        eyebrow="Equipo"
        image="/brand/gallery-youth.jpg"
      />

      <RevealSection>
        <section className="section-shell section-padding">
          <div className="grid gap-8 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)] lg:items-start">
            <div>
              <p className="eyebrow">Proceso por edades</p>
              <h2 className="mt-4 text-balance text-3xl font-black leading-[1.05] sm:text-4xl lg:text-5xl">
                Cada categoría tiene una intención técnica y humana.
              </h2>
              <p className="mt-5 text-base leading-8 text-muted">
                El registro de jugadores se organiza por año de nacimiento y permite
                mantener convocatorias, seguimiento público y edición administrativa.
              </p>
              <Link
                href="/contacto"
                className="btn-gold mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black"
              >
                Inscribirme
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {sportCategoryCards.map((category) => (
                <article
                  key={category.id}
                  className="premium-card overflow-hidden"
                >
                  <div className="relative aspect-[16/9] bg-surface">
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <p className="absolute bottom-3 left-4 text-xs font-black uppercase tracking-normal text-[#f3c548]">
                      {category.range}
                    </p>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-black">{category.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <section className="section-shell pb-24">
          <div className="mb-8 max-w-2xl">
            <p className="eyebrow">Registro deportivo</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Plantilla y convocatorias
            </h2>
          </div>
          <PlayerManager initialItems={players} />
        </section>
      </RevealSection>
    </main>
  );
}
