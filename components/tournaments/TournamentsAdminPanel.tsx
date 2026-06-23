"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Trophy, Zap, CalendarDays, Edit3, ChevronDown, ChevronUp } from "lucide-react";
import { CurrentTournamentManager } from "./CurrentTournamentManager";
import { TournamentManager } from "./TournamentManager";
import { TournamentSectionsManager } from "./TournamentSectionsManager";
import type { Tournament, TournamentStatus } from "@/lib/tournament-store";
import type { CurrentTournament } from "@/lib/current-tournament-store";
import type { TournamentSectionCopy } from "./TournamentSectionsManager";

type AdminPanel = "current" | "played" | "won" | "upcoming" | "scheduled";

type Props = {
  currentTournament: CurrentTournament | null;
  tournaments: Tournament[];
  sections: TournamentSectionCopy[];
  sectionOverrides: Record<string, string>;
};

const panelConfig: Record<
  AdminPanel,
  { icon: typeof Trophy; title: string; description: string; status?: TournamentStatus }
> = {
  current: {
    icon: Zap,
    title: "Actual",
    description: "Torneo principal en disputa",
  },
  played: {
    icon: Trophy,
    title: "Jugados",
    description: "Historial de participaciones",
    status: "played",
  },
  won: {
    icon: Trophy,
    title: "Ganados",
    description: "Campeonatos y victorias",
    status: "won",
  },
  upcoming: {
    icon: Clock,
    title: "Por jugar",
    description: "Próximos encuentros",
    status: "upcoming",
  },
  scheduled: {
    icon: CalendarDays,
    title: "Programación",
    description: "Agenda competitiva",
    status: "scheduled",
  },
};

export function TournamentsAdminPanel({
  currentTournament,
  tournaments,
  sections,
  sectionOverrides,
}: Props) {
  const [activePanel, setActivePanel] = useState<AdminPanel>("current");
  const [unlocked, setUnlocked] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  const [showTextEditor, setShowTextEditor] = useState(false);

  useEffect(() => {
    const syncAdminAccess = () => {
      const key = window.sessionStorage.getItem("cdrs-admin-key");
      setAccessKey(key || "");
      setUnlocked(Boolean(key));
    };

    syncAdminAccess();
    window.addEventListener("cdrs-admin-login", syncAdminAccess);
    window.addEventListener("cdrs-admin-logout", syncAdminAccess);

    return () => {
      window.removeEventListener("cdrs-admin-login", syncAdminAccess);
      window.removeEventListener("cdrs-admin-logout", syncAdminAccess);
    };
  }, []);

  if (!unlocked) {
    return null;
  }

  const renderPanelContent = () => {
    switch (activePanel) {
      case "current":
        return (
          <CurrentTournamentManager
            initialItem={currentTournament}
            showPreview={false}
            externalAccessKey={accessKey}
            externalUnlocked={unlocked}
          />
        );
      case "played":
        return (
          <TournamentManager
            initialItems={tournaments}
            showList={true}
            statusFilter="played"
            hideStatusSelector={true}
            title="Torneos jugados"
            description="Administra los torneos y partidos ya disputados."
            defaultVisibility="published"
            externalAccessKey={accessKey}
            externalUnlocked={unlocked}
          />
        );
      case "won":
        return (
          <TournamentManager
            initialItems={tournaments}
            showList={true}
            statusFilter="won"
            hideStatusSelector={true}
            title="Torneos ganados"
            description="Administra los campeonatos y victorias del club."
            defaultVisibility="published"
            externalAccessKey={accessKey}
            externalUnlocked={unlocked}
          />
        );
      case "upcoming":
        return (
          <TournamentManager
            initialItems={tournaments}
            showList={true}
            statusFilter="upcoming"
            hideStatusSelector={true}
            title="Próximos encuentros"
            description="Administra los partidos y torneos por jugar."
            defaultVisibility="published"
            externalAccessKey={accessKey}
            externalUnlocked={unlocked}
          />
        );
      case "scheduled":
        return (
          <TournamentManager
            initialItems={tournaments}
            showList={true}
            statusFilter="scheduled"
            hideStatusSelector={true}
            title="Programación"
            description="Administra la agenda competitiva del club."
            defaultVisibility="published"
            externalAccessKey={accessKey}
            externalUnlocked={unlocked}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="section-shell section-padding">
      <div className="rounded-lg border border-border bg-bg-elevated p-6 sm:p-8">
        <div className="mb-8">
          <p className="eyebrow">Administrador</p>
          <h2 className="font-stadium mt-3 text-3xl font-black sm:text-4xl">
            Gestión de torneos
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Controla el torneo actual, resultados históricos y programación
            competitiva desde un solo lugar.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(panelConfig) as AdminPanel[]).map((panelKey) => {
            const config = panelConfig[panelKey];
            const Icon = config.icon;
            const isActive = activePanel === panelKey;

            return (
              <button
                key={panelKey}
                type="button"
                onClick={() => setActivePanel(panelKey)}
                className={`alive-card relative flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition-all ${
                  isActive
                    ? "border-accent bg-accent/5"
                    : "border-border bg-bg hover:border-accent/50"
                }`}
              >
                <div
                  className={`grid size-10 place-items-center rounded-lg ${
                    isActive ? "bg-accent text-[var(--button-text)]" : "bg-accent/15 text-accent"
                  }`}
                >
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className={`text-sm font-black ${isActive ? "text-accent" : "text-text"}`}>
                    {config.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{config.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8">{renderPanelContent()}</div>

        <div className="mt-8 border-t border-border pt-6">
          <button
            type="button"
            onClick={() => setShowTextEditor(!showTextEditor)}
            className="flex items-center gap-2 text-sm font-black text-muted hover:text-text transition-colors"
          >
            <Edit3 size={16} aria-hidden="true" />
            Editar textos de la página
            {showTextEditor ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
          </button>

          {showTextEditor && (
            <div className="mt-4">
              <TournamentSectionsManager sections={sections} initialValues={sectionOverrides} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
