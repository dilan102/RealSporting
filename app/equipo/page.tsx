import type { Metadata } from "next";
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
        <section className="section-shell section-padding pb-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)] lg:items-start">
            <div>
              <p className="eyebrow">Proceso por edades</p>
              <h2 className="font-categories mt-4 text-balance text-4xl font-black leading-[0.96] sm:text-5xl lg:text-6xl">
                Cada categoría tiene una intención técnica y humana.
              </h2>
              <p className="mt-5 text-base leading-8 text-muted">
                El registro de jugadores se organiza por año de nacimiento. Haz clic en
                una categoría para ver su plantilla, convocatorias y seguimiento público.
              </p>
              <nav className="mt-6 flex flex-wrap gap-2" aria-label="Ir a una categoría">
                {sportCategoryCards.map((category) => (
                  <a
                    key={category.id}
                    href={`#categoria-${category.id}`}
                    className="alive-lift rounded-full border border-border bg-bg-elevated px-3 py-1.5 text-xs font-black text-text transition-colors hover:border-accent hover:text-accent"
                  >
                    {category.name}
                  </a>
                ))}
              </nav>
              <Link
                href="/formulario-miembros-2026"
                className="btn-gold alive-lift mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-black"
              >
                Inscribirme
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <PlayerManager initialItems={players} />
          </div>
        </section>
      </RevealSection>
    </main>
  );
}
