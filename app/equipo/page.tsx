import type { Metadata } from "next";
import { PlayerManager } from "@/components/equipo/PlayerManager";
import { RevealSection } from "@/components/ui/RevealSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { club } from "@/lib/content";
import { readPlayers } from "@/lib/player-store";

export const metadata: Metadata = {
  title: "Equipo",
  description: `Plantilla y jugadores de ${club.name}.`,
  openGraph: {
    images: ["https://real-sporting.vercel.app/logo.png"],
  },
};

export default async function EquipoPage() {
  const players = await readPlayers();

  return (
    <div className="bg-bg pt-24 text-text sm:pt-28">
      <RevealSection>
      <section className="relative overflow-hidden border-b border-border bg-bg-elevated">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Plantilla"
          title="Categorías del equipo"
          description="Organización por edades y cuerpo técnico, con cupos totales y convocados en secciones desplegables."
          align="center"
        />
        </div>
      </section>
      </RevealSection>

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
