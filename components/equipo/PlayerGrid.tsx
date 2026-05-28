"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Pencil, Plus } from "lucide-react";
import { teamCategories } from "@/lib/content";
import type { Player, TeamCategoryId, TeamSection } from "@/lib/content";
import { fadeUpItem, staggerContainer } from "@/lib/motion";
import { PlayerCard } from "./PlayerCard";

type PlayerGridProps = {
  sections: TeamSection[];
  canManage?: boolean;
  onAddPlayer?: (category: TeamCategoryId) => void;
  onEditPlayer?: (player: Player) => void;
};

export function PlayerGrid({
  sections,
  canManage = false,
  onAddPlayer,
  onEditPlayer,
}: PlayerGridProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<Record<string, "jugadores" | "convocados">>({});

  const technicalDefinitions: Record<TeamCategoryId, string> = {
    "2020-2019":
      "Pre-Benjamín (6-7 años): Centrado en la Diversión, el Desarrollo Psicomotor Básico y la Familiarización con el Balón. Sesiones de 45 a 60 minutos.",
    "2018-2017":
      "Benjamín (8-9 años): Centrado en los Fundamentos Técnicos Básicos, el Trabajo en Equipo Simple y el conocimiento de las Reglas. Sesiones de 60 a 75 minutos.",
    "2016-2015":
      "Alevín (10-11 años): Centrado en el Perfeccionamiento de la Técnica Específica, la Táctica Elemental y la Toma de Decisiones. Sesiones de 75 a 90 minutos.",
    "2014-2013":
      "Infantil (12-13 años): Centrado en la Consolidación Técnica, la Introducción a la Táctica Compleja y la Preparación Física General. Sesiones de 90 a 105 minutos.",
    "2012-2011":
      "Cadete (14-15 años): Centrado en el Entrenamiento Específico de Puesto, la Táctica Avanzada y la Preparación Física Orientada al Rendimiento. Sesiones de 90 a 120 minutos.",
    "2010-2009":
      "Juvenil (16-17 años): Centrado en el Alto Rendimiento, la Especialización Táctica en el Rol y la Preparación Física Profesionalizada. Sesiones de 105 a 135 minutos.",
    "2008-2007":
      "Juvenil (16-17 años): Centrado en el Alto Rendimiento, la Especialización Táctica en el Rol y la Preparación Física Profesionalizada. Sesiones de 105 a 135 minutos.",
  };

  const CATEGORY_NAMES: Record<string, string> = {
    "2020-2019": "Pre-Benjamín",
    "2018-2017": "Benjamín",
    "2016-2015": "Alevín",
    "2014-2013": "Infantil",
    "2012-2011": "Cadete",
    "2010-2009": "Juvenil",
    "2008-2007": "Sub-20",
    Entrenadores: "Cuerpo Técnico",
    entrenadores: "Cuerpo Técnico",
  };

  const toggleCategory = (id: string) => {
    setOpenCategories((current) => ({ ...current, [id]: !current[id] }));
  };

  const sectionPlayers = useMemo(() => {
    return sections.reduce<Record<string, Player[]>>((acc, section) => {
      const unique = new Map<string, Player>();
      section.groups.forEach((group) => {
        group.slots.forEach((slot) => {
          if (slot.player) {
            unique.set(slot.player.id, slot.player);
          }
        });
      });
      acc[section.id] = Array.from(unique.values());
      return acc;
    }, {});
  }, [sections]);

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-40px" }}
    >
      {sections.map((section) => (
        <motion.section
          key={section.id}
          variants={fadeUpItem}
          className="glass mobile-card-lift overflow-hidden rounded-lg"
        >
          {section.id !== "entrenadores" ? (
            <>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 border-b border-border bg-bg-elevated/60 px-5 py-5 text-left transition-colors hover:bg-bg-elevated sm:px-6"
                onClick={() => {
                  toggleCategory(section.id);
                  setActiveTab((current) => ({
                    ...current,
                    [section.id]: current[section.id] || "jugadores",
                  }));
                }}
                aria-expanded={Boolean(openCategories[section.id])}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-secondary">
                    {CATEGORY_NAMES[section.id] ?? section.title}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold">{section.title}</h3>
                </div>
                <ChevronDown
                  size={22}
                  className={`text-muted transition-transform duration-300 ${openCategories[section.id] ? "rotate-180 text-accent" : ""}`}
                  aria-hidden="true"
                />
              </button>

              <div
                className={`grid transition-all duration-300 ${
                  openCategories[section.id] ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="space-y-6 p-4 sm:p-6">
                    {teamCategories.includes(section.id as TeamCategoryId) && (
                      <article className="rounded-lg border border-border bg-bg/70 p-4 sm:p-5">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                          Definición técnica
                        </p>
                        <p className="mt-3 text-sm leading-7 text-muted">
                          {technicalDefinitions[section.id as TeamCategoryId]}
                        </p>
                      </article>
                    )}

                    <div className="rounded-lg border border-border bg-bg/70 p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveTab((current) => ({ ...current, [section.id]: "jugadores" }))
                            }
                            className={`rounded-lg px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition-colors ${
                              (activeTab[section.id] || "jugadores") === "jugadores"
                                ? "bg-accent text-[var(--button-text)]"
                                : "bg-bg text-muted hover:text-text"
                            }`}
                          >
                            Jugadores
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setActiveTab((current) => ({ ...current, [section.id]: "convocados" }))
                            }
                            className={`rounded-lg px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition-colors ${
                              (activeTab[section.id] || "jugadores") === "convocados"
                                ? "bg-accent text-[var(--button-text)]"
                                : "bg-bg text-muted hover:text-text"
                            }`}
                          >
                            Convocados
                          </button>
                        </div>
                        {canManage && section.id !== "entrenadores" && (
                          <button
                            type="button"
                            onClick={() => onAddPlayer?.(section.id as TeamCategoryId)}
                            className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-bold text-accent transition-colors hover:bg-accent/15"
                          >
                            <Plus size={14} aria-hidden="true" />
                            Añadir jugador
                          </button>
                        )}
                      </div>

                      {(activeTab[section.id] || "jugadores") === "jugadores" && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {sectionPlayers[section.id]?.length ? (
                            sectionPlayers[section.id].map((player) => (
                              <div key={player.id} className="relative">
                                <PlayerCard player={player} />
                                {canManage && (
                                  <button
                                    type="button"
                                    onClick={() => onEditPlayer?.(player)}
                                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg/90 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                                    aria-label={`Editar ${player.name}`}
                                  >
                                    <Pencil size={14} aria-hidden="true" />
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="sm:col-span-2 lg:col-span-3 rounded-lg border border-dashed border-border bg-bg/60 p-4 text-sm text-muted">
                              No hay jugadores registrados en esta categoría.
                            </p>
                          )}
                        </div>
                      )}

                      {(activeTab[section.id] || "jugadores") === "convocados" && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {sectionPlayers[section.id]
                            ?.filter((player) => player.convocado === "SI")
                            .map((player) => (
                              <div key={player.id} className="relative">
                                <PlayerCard player={player} />
                                {canManage && (
                                  <button
                                    type="button"
                                    onClick={() => onEditPlayer?.(player)}
                                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg/90 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                                    aria-label={`Editar ${player.name}`}
                                  >
                                    <Pencil size={14} aria-hidden="true" />
                                  </button>
                                )}
                              </div>
                            ))}
                          {!sectionPlayers[section.id]?.some((player) => player.convocado === "SI") && (
                            <p className="sm:col-span-2 lg:col-span-3 rounded-lg border border-dashed border-border bg-bg/60 p-4 text-sm text-muted">
                              No hay jugadores convocados en esta categoría.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="border-b border-border bg-bg-elevated/50 px-5 py-5 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-secondary">
                {CATEGORY_NAMES.Entrenadores}
              </p>
              <h3 className="mt-1 text-2xl font-bold">{section.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                {section.description}
              </p>
            </div>
          )}
        </motion.section>
      ))}
    </motion.div>
  );
}
