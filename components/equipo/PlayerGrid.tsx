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

const technicalDefinitions: Record<TeamCategoryId, string> = {
  "2020-2019":
    "Proceso de iniciación (6-7 años): prioriza diversión, psicomotricidad básica y familiarización con el balón. Microciclo de 45 a 60 minutos.",
  "2018-2017":
    "Formación base (8-9 años): consolidación de fundamentos técnicos, trabajo en equipo y comprensión reglamentaria. Microciclo de 60 a 75 minutos.",
  "2016-2015":
    "Etapa de perfeccionamiento (10-11 años): técnica específica, táctica elemental y toma de decisiones bajo presión. Microciclo de 75 a 90 minutos.",
  "2014-2013":
    "Consolidación técnica (12-13 años): introducción a sistemas tácticos y preparación física general. Microciclo de 90 a 105 minutos.",
  "2012-2011":
    "Especialización inicial (14-15 años): entrenamiento por puesto, táctica avanzada y rendimiento físico orientado. Microciclo de 90 a 120 minutos.",
  "2010-2009":
    "Alto rendimiento formativo (16-17 años): especialización de rol, lectura de juego y exigencia competitiva. Microciclo de 105 a 135 minutos.",
  "2008-2007":
    "Proyección competitiva (16-17 años): optimización física y táctica para exigencias de torneo. Microciclo de 105 a 135 minutos.",
};

function isConvocado(player: Player) {
  return player.convocado === "SI";
}

function PlayerList({
  players,
  emptyMessage,
  canManage,
  onEditPlayer,
}: {
  players: Player[];
  emptyMessage: string;
  canManage?: boolean;
  onEditPlayer?: (player: Player) => void;
}) {
  if (players.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-bg/60 p-4 text-sm text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {players.map((player) => (
        <div key={player.id} className="relative">
          <PlayerCard player={player} />
          {canManage && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEditPlayer?.(player);
              }}
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-bg/90 text-muted transition-colors hover:border-accent/50 hover:text-accent"
              aria-label={`Editar ${player.name}`}
            >
              <Pencil size={12} aria-hidden="true" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export function PlayerGrid({
  sections,
  canManage = false,
  onAddPlayer,
  onEditPlayer,
}: PlayerGridProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

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

  const toggleCategory = (id: string) => {
    setOpenCategories((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-40px" }}
    >
      {sections.map((section) => {
        const categoryName = CATEGORY_NAMES[section.id] ?? section.title;
        const players = sectionPlayers[section.id] ?? [];
        const convocados = players.filter(isConvocado);

        return (
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
                  onClick={() => toggleCategory(section.id)}
                  aria-expanded={Boolean(openCategories[section.id])}
                >
                  <div>
                    <h3 className="text-2xl font-bold text-text">{categoryName}</h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
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
                    openCategories[section.id] ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="space-y-4 p-4 sm:p-6">
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

                      {canManage && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => onAddPlayer?.(section.id as TeamCategoryId)}
                            className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-bold text-accent transition-colors hover:bg-accent/15"
                          >
                            <Plus size={14} aria-hidden="true" />
                            Añadir jugador
                          </button>
                        </div>
                      )}

                      <details
                        className="group overflow-hidden rounded-lg border border-border bg-bg/70 open:bg-bg-elevated/60"
                        open
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-surface sm:px-5 [&::-webkit-details-marker]:hidden">
                          <span className="text-sm font-black uppercase tracking-[0.12em] text-text">
                            Jugadores
                          </span>
                          <span className="rounded-md bg-accent/10 px-2 py-1 text-xs font-bold text-accent">
                            {players.length}
                          </span>
                        </summary>
                        <div className="border-t border-border p-4 sm:p-5">
                          <PlayerList
                            players={players}
                            emptyMessage="No hay jugadores registrados en esta categoría."
                            canManage={canManage}
                            onEditPlayer={onEditPlayer}
                          />
                        </div>
                      </details>

                      <details className="group overflow-hidden rounded-lg border border-border bg-bg/70 open:bg-bg-elevated/60">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-surface sm:px-5 [&::-webkit-details-marker]:hidden">
                          <span className="text-sm font-black uppercase tracking-[0.12em] text-text">
                            Convocados
                          </span>
                          <span className="rounded-md bg-accent/10 px-2 py-1 text-xs font-bold text-accent">
                            {convocados.length}
                          </span>
                        </summary>
                        <div className="border-t border-border p-4 sm:p-5">
                          <PlayerList
                            players={convocados}
                            emptyMessage="No hay jugadores convocados en esta categoría."
                            canManage={canManage}
                            onEditPlayer={onEditPlayer}
                          />
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="border-b border-border bg-bg-elevated/50 px-5 py-5 sm:px-6">
                <h3 className="text-2xl font-bold">{categoryName}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{section.description}</p>
              </div>
            )}
          </motion.section>
        );
      })}
    </motion.div>
  );
}
