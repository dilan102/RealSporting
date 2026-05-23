import type { Metadata } from "next";
import { PlayerManager } from "@/components/equipo/PlayerManager";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { club } from "@/lib/content";
import { readPlayers } from "@/lib/player-store";

export const metadata: Metadata = {
  title: "Equipo",
  description: `Plantilla y jugadores de ${club.name}.`,
};

export default async function EquipoPage() {
  const players = await readPlayers();

  return (
    <div className="pt-28">
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Plantilla"
          title="Categorías del equipo"
          description="Organización por edades y cuerpo técnico, con cupos totales y convocados en secciones desplegables."
          align="center"
        />
        <div className="mt-12">
          <PlayerManager initialItems={players} />
        </div>
      </section>
    </div>
  );
}
