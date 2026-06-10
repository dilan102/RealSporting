"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Player, TeamCategoryId, TeamSection } from "@/lib/content";
import { CategoryRosterContent, playersFromSection } from "./CategoryRosterContent";

type PlayerGridProps = {
  sections: TeamSection[];
  canManage?: boolean;
  onAddPlayer?: (category: TeamCategoryId) => void;
  onEditPlayer?: (player: Player) => void;
};

const CATEGORY_NAMES: Record<string, string> = {
  "2020-2019": "Pre-Benjamín",
  "2018-2017": "Benjamín",
  "2016-2015": "Alevín",
  "2014-2013": "Infantil",
  "2012-2011": "Cadete",
  "2010-2009": "Juvenil",
  "2008-2007": "Sub-20",
  entrenadores: "Cuerpo Técnico",
};

export function PlayerGrid({
  sections,
  canManage = false,
  onAddPlayer,
  onEditPlayer,
}: PlayerGridProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const sectionPlayers = useMemo(() => {
    return sections.reduce<Record<string, ReturnType<typeof playersFromSection>>>(
      (acc, section) => {
        acc[section.id] = playersFromSection(section);
        return acc;
      },
      {},
    );
  }, [sections]);

  const toggleCategory = (id: string) => {
    setOpenCategories((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <div
      className="stagger-container space-y-8"
    >
      {sections
        .filter((section) => {
          if (section.id === "entrenadores") {
            const coaches = sectionPlayers[section.id] ?? [];
            return canManage || coaches.length > 0;
          }

          return true;
        })
        .map((section) => {
          const categoryName = CATEGORY_NAMES[section.id] ?? section.title;
          const players = sectionPlayers[section.id] ?? [];

          return (
            <section
              key={section.id}
              className="animate-fade-in glass mobile-card-lift overflow-hidden rounded-lg"
            >
              {section.id !== "entrenadores" ? (
                <>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 border-b border-border bg-bg-elevated/60 px-5 py-5 text-left transition-colors hover:bg-bg-elevated sm:px-6"
                    onClick={() => toggleCategory(section.id)}
                    aria-expanded={Boolean(openCategories[section.id])}
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-text">{categoryName}</h3>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-normal text-muted">
                        Rango {section.title} · {players.length} integrantes
                      </p>
                    </div>
                    <ChevronDown
                      size={22}
                      className={`text-muted transition-transform duration-300 ${openCategories[section.id] ? "rotate-180 text-accent" : ""}`}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      openCategories[section.id]
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <CategoryRosterContent
                        section={section}
                        canManage={canManage}
                        onAddPlayer={onAddPlayer}
                        onEditPlayer={onEditPlayer}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-border bg-bg-elevated/50 px-5 py-5 sm:px-6">
                    <h3 className="text-2xl font-bold">{categoryName}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                      {section.description}
                    </p>
                  </div>
                  <CategoryRosterContent
                    section={section}
                    canManage={canManage}
                    onAddPlayer={onAddPlayer}
                    onEditPlayer={onEditPlayer}
                  />
                </>
              )}
            </section>
          );
        })}
    </div>
  );
}
