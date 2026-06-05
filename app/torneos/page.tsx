import type { Metadata } from "next";
import { Trophy, Zap } from "lucide-react";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { CurrentTournamentCard } from "@/components/tournaments/CurrentTournamentCard";
import { TournamentManager } from "@/components/tournaments/TournamentManager";
import { CurrentTournamentManager } from "@/components/tournaments/CurrentTournamentManager";
import { TournamentSectionsManager } from "@/components/tournaments/TournamentSectionsManager";
import { PageHero } from "@/components/ui/PageHero";
import { RevealSection } from "@/components/ui/RevealSection";
import { club } from "@/lib/content";
import { contentOverride, readContentOverrides } from "@/lib/content-overrides";
import { readTournaments, type Tournament, type TournamentStatus } from "@/lib/tournament-store";
import { readCurrentTournament } from "@/lib/current-tournament-store";
import { pageOpenGraph } from "@/lib/site";

export const metadata: Metadata = {
  title: "Torneos",
  description: `Torneos jugados, ganados y por jugar de ${club.name}.`,
  openGraph: pageOpenGraph(
    `Torneos | ${club.name}`,
    `Torneos jugados, ganados y por jugar de ${club.name}.`,
  ),
};

export const dynamic = "force-dynamic";

const defaultSections: {
  status: TournamentStatus;
  title: string;
  description: string;
}[] = [
  {
    status: "played",
    title: "Torneos jugados",
    description: "Participaciones finalizadas que fortalecen experiencia y proceso competitivo.",
  },
  {
    status: "won",
    title: "Torneos ganados",
    description: "Logros competitivos y campeonatos que marcan la historia del club.",
  },
  {
    status: "future",
    title: "Torneos por jugar",
    description: "Próximas competencias en planeación o confirmadas por la institución.",
  },
];

function sectionCount(items: Tournament[], status: TournamentStatus) {
  return items.filter((item) => item.status === status).length;
}

export default async function TorneosPage() {
  const overrides = await readContentOverrides();
  const tournaments = await readTournaments();
  const currentTournament = await readCurrentTournament();
  const orderedTournaments = [...tournaments].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  );
  const sections = defaultSections.map((section) => ({
    ...section,
    title: contentOverride(
      overrides,
      `torneos.sections.${section.status}.title`,
      section.title,
    ),
    description: contentOverride(
      overrides,
      `torneos.sections.${section.status}.description`,
      section.description,
    ),
  }));
  const hero = {
    eyebrow: contentOverride(overrides, "torneos.hero.eyebrow", "Competencia"),
    title: contentOverride(overrides, "torneos.hero.title", "Torneos"),
    subtitle: contentOverride(
      overrides,
      "torneos.hero.subtitle",
      "Programación competitiva, resultados, participaciones y próximos retos del club.",
    ),
  };
  const adminSection = {
    eyebrow: contentOverride(overrides, "torneos.admin.eyebrow", "Administrador"),
    title: contentOverride(overrides, "torneos.admin.title", "Subir programación"),
  };

  return (
    <main className="bg-bg text-text">
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        eyebrow={hero.eyebrow}
        image="/brand/gallery-team.jpg"
      />

      <RevealSection>
        <section className="section-shell section-padding">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <TournamentSectionsManager sections={defaultSections} initialValues={overrides} />

      {currentTournament && (
        <RevealSection>
          <section className="section-shell scroll-mt-28 py-10">
            <div className="mb-7 max-w-3xl">
              <p className="eyebrow flex items-center gap-2">
                <Zap size={16} className="text-accent" />
                En vivo
              </p>
              <h2 className="font-stadium mt-3 text-4xl font-black sm:text-5xl">
                Torneo Actual
              </h2>
              <p className="mt-3 text-base leading-7 text-muted">
                Competencia en disputa donde participa el club en este momento.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <CurrentTournamentCard item={currentTournament} />
            </div>
          </section>
        </RevealSection>
      )}

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
            <p className="eyebrow">{adminSection.eyebrow}</p>
            <h2 className="font-stadium mt-3 text-4xl font-black sm:text-5xl">
              {adminSection.title}
            </h2>
          </div>

          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-4">Torneo Actual</h3>
            <CurrentTournamentManager initialItem={currentTournament} />
          </div>

          <h3 className="text-2xl font-bold mb-4">Otros Torneos</h3>
          <TournamentManager initialItems={orderedTournaments} showList={false} />
        </section>
      </RevealSection>
    </main>
  );
}
