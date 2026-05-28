"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Pencil, Plus } from "lucide-react";
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
  const technicalDefinitions = useMemo(
    () => ({
      "2020-2019":
        "Pre-Benjamin (6-7 anos): Centrado en la Diversion, el Desarrollo Psicomotor Basico y la Familiarizacion con el Balon. Sesiones de 45 a 60 minutos.",
      "2018-2017":
        "Benjamin (8-9 anos): Centrado en los Fundamentos Tecnicos Basicos, el Trabajo en Equipo Simple y el conocimiento de las Reglas. Sesiones de 60 a 75 minutos.",
      "2016-2015":
        "Alevin (10-11 anos): Centrado en el Perfeccionamiento de la Tecnica Especifica, la Tactica Elemental y la Toma de Decisiones. Sesiones de 75 a 90 minutos.",
      "2014-2013":
        "Infantil (12-13 anos): Centrado en la Consolidacion Tecnica, la Introduccion a la Tactica Compleja y la Preparacion Fisica General. Sesiones de 90 a 105 minutos.",
      "2012-2011":
        "Cadete (14-15 anos): Centrado en el Entrenamiento Especifico de Puesto, la Tactica Avanzada y la Preparacion Fisica Orientada al Rendimiento. Sesiones de 90 a 120 minutos.",
      "2010-2009":
        "Juvenil (16-17 anos): Centrado en el Alto Rendimiento, la Especializacion Tactica en el Rol y la Preparacion Fisica Profesionalizada. Sesiones de 105 a 135 minutos.",
      "2008-2007":
        "Juvenil (16-17 anos): Centrado en el Alto Rendimiento, la Especializacion Tactica en el Rol y la Preparacion Fisica Profesionalizada. Sesiones de 105 a 135 minutos.",
    }),
    [],
  );

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
                onClick={() => toggleCategory(section.id)}
                aria-expanded={Boolean(openCategories[section.id])}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-secondary">
                    Categoria
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
                    <article className="rounded-lg border border-border bg-bg/70 p-4 sm:p-5">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                        Definicion tecnica
                      </p>
                      <p className="mt-3 text-sm leading-7 text-muted">
                        {technicalDefinitions[section.id] || section.description}
                      </p>
                    </article>

                    <article className="rounded-lg border border-border bg-bg/70 p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                          Jugadores en entrenamiento
                        </p>
                        {canManage && (
                          <button
                            type="button"
                            onClick={() => onAddPlayer?.(section.id as TeamCategoryId)}
                            className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-bold text-accent transition-colors hover:bg-accent/15"
                          >
                            <Plus size={14} aria-hidden="true" />
                            Anadir jugador
                          </button>
                        )}
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {section.groups
                          .find((group) => group.id.endsWith("-jugadores"))
                          ?.slots.filter((slot) => slot.player && slot.player.convocado !== "SI")
                          .map((slot) => (
                            <div key={slot.id} className="relative">
                              {slot.player && <PlayerCard player={slot.player} />}
                              {canManage && slot.player && (
                                <button
                                  type="button"
                                  onClick={() => onEditPlayer?.(slot.player as Player)}
                                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg/90 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                                  aria-label={`Editar ${slot.player.name}`}
                                >
                                  <Pencil size={14} aria-hidden="true" />
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                    </article>

                    <article className="rounded-lg border border-border bg-bg/70 p-4 sm:p-5">
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-accent">
                        Jugadores convocados
                      </p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {section.groups
                          .find((group) => group.id.endsWith("-convocados"))
                          ?.slots.filter((slot) => slot.player)
                          .map((slot) => (
                            <div key={slot.id} className="relative">
                              {slot.player && <PlayerCard player={slot.player} />}
                              {canManage && slot.player && (
                                <button
                                  type="button"
                                  onClick={() => onEditPlayer?.(slot.player as Player)}
                                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg/90 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                                  aria-label={`Editar ${slot.player.name}`}
                                >
                                  <Pencil size={14} aria-hidden="true" />
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="border-b border-border bg-bg-elevated/50 px-5 py-5 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-secondary">
                Categoria
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
