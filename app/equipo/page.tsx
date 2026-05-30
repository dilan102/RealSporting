import type { Metadata } from "next";
import { PlayerManager } from "@/components/equipo/PlayerManager";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { club } from "@/lib/content";
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

export default async function EquipoPage() {
  const players = await readPlayers();

  return (
    <div className="bg-bg pt-24 text-text sm:pt-28">
      <PageHero title="Plantilla" subtitle="Categorías y cuerpo técnico 2026" />

      <RevealSection>
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <div>
          <PlayerManager initialItems={players} />
        </div>
      </section>
      </RevealSection>
    </div>
  );
}
