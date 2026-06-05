import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { TournamentManager } from "@/components/tournaments/TournamentManager";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { club } from "@/lib/content";
import { readTournaments, type Tournament, type TournamentStatus } from "@/lib/tournament-store";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Torneos",
  description: `Torneos ganados, jugados, actuales y próximos de ${club.name}.`,
  openGraph: pageOpenGraph(
    `Torneos | ${club.name}`,
    `Torneos ganados, jugados, actuales y próximos de ${club.name}.`,
  ),
};

export const dynamic = "force-dynamic";

const sections: {
  status: TournamentStatus;
  title: string;
  description: string;
}[] = [
  {
    status: "won",
    title: "Torneo ganado",
    description: "Logros competitivos y campeonatos que marcan la historia del club.",
  },
  {
    status: "played",
    title: "Torneos jugados",
    description: "Participaciones finalizadas que fortalecen experiencia y proceso competitivo.",
  },
  {
    status: "future",
    title: "Torneos a futuro",
    description: "Próximas competencias en planeación o confirmadas por la institución.",
  },
  {
    status: "current",
    title: "Torneos actuales",
    description: "Competencias en curso con programación activa para jugadores y familias.",
  },
];

function sectionCount(items: Tournament[], status: TournamentStatus) {
  return items.filter((item) => item.status === status).length;
}

export default async function TorneosPage() {
  const tournaments = await readTournaments();
  const orderedTournaments = [...tournaments].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  );

  return (
    <main className="bg-bg text-text">
      <PageHero
        title="Torneos"
        subtitle="Programación competitiva, resultados, participaciones y próximos retos del club."
        eyebrow="Competencia"
        image="/brand/gallery-team.jpg"
      />

      <RevealSection>
        <section className="section-shell section-padding">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => (
              <a
                key={section.status}
                href={`#${section.status}`}
                className="alive-card rounded-lg border border-border bg-bg-elevated p-5"
              >
                <span className="grid size-11 place-items-center rounded-lg bg-accent/15 text-accent">
                  <Trophy size={21} aria-hidden="true" />
                </span>
                <p className="mt-5 text-3xl font-black">
                  {sectionCount(orderedTournaments, section.status)}
                </p>
                <h2 className="mt-2 text-sm font-black uppercase tracking-normal text-text">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">{section.description}</p>
              </a>
            ))}
          </div>
        </section>
      </RevealSection>

      {sections.map((section) => {
        const items = orderedTournaments.filter((item) => item.status === section.status);

        return (
          <RevealSection key={section.status}>
            <section id={section.status} className="section-shell scroll-mt-28 py-10">
              <div className="mb-7 max-w-3xl">
                <p className="eyebrow">Torneos</p>
                <h2 className="font-stadium mt-3 text-4xl font-black sm:text-5xl">
                  {section.title}
                </h2>
                <p className="mt-3 text-base leading-7 text-muted">{section.description}</p>
              </div>

              {items.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <TournamentCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-bg-elevated p-6 text-center">
                  <p className="text-sm font-semibold text-text">
                    No hay publicaciones en esta sección todavía.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Cuando el administrador suba programación de esta categoría, aparecerá aquí.
                  </p>
                </div>
              )}
            </section>
          </RevealSection>
        );
      })}

      <RevealSection>
        <section className="section-shell pb-24 pt-8">
          <div className="mb-6 max-w-3xl">
            <p className="eyebrow">Administrador</p>
            <h2 className="font-stadium mt-3 text-4xl font-black sm:text-5xl">
              Subir programación
            </h2>
          </div>
          <TournamentManager initialItems={orderedTournaments} showList={false} />
        </section>
      </RevealSection>
    </main>
  );
}
