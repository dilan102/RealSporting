"use client";

import { Pencil, Plus } from "lucide-react";
import { teamCategories } from "@/lib/content";
import type { Player, TeamCategoryId, TeamSection } from "@/lib/content";
import { PlayerCard } from "./PlayerCard";

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
    "Sub-18 / Senior formativo (17-18 años): proyección competitiva, optimización física y táctica para exigencias de torneo. Microciclo de 105 a 135 minutos.",
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

function playersFromSection(section: TeamSection): Player[] {
  const unique = new Map<string, Player>();
  section.groups.forEach((group) => {
    group.slots.forEach((slot) => {
      if (slot.player) {
        unique.set(slot.player.id, slot.player);
      }
    });
  });
  return Array.from(unique.values());
}

type CategoryRosterContentProps = {
  section: TeamSection;
  canManage?: boolean;
  onAddPlayer?: (category: TeamCategoryId) => void;
  onEditPlayer?: (player: Player) => void;
};

export function CategoryRosterContent({
  section,
  canManage = false,
  onAddPlayer,
  onEditPlayer,
}: CategoryRosterContentProps) {
  const players = playersFromSection(section);
  const convocados = players.filter(isConvocado);
  const isCoachSection = section.id === "entrenadores";

  if (isCoachSection) {
    return (
      <div className="space-y-4 border-t border-border p-4 sm:p-5">
        <p className="text-sm leading-relaxed text-muted">{section.description}</p>
        {players.length === 0 && !canManage ? (
          <p className="rounded-lg border border-dashed border-border bg-bg/60 p-4 text-sm text-muted">
            Cuerpo técnico en proceso de registro.
          </p>
        ) : (
          <PlayerList
            players={players}
            emptyMessage="No hay integrantes registrados en el cuerpo técnico."
            canManage={canManage}
            onEditPlayer={onEditPlayer}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 border-t border-border p-4 sm:p-5">
      {teamCategories.includes(section.id as TeamCategoryId) && (
        <article className="rounded-lg border border-border bg-bg/70 p-4 sm:p-5">
          <p className="text-xs font-black uppercase tracking-normal text-accent">
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

      {players.length === 0 && !canManage ? (
        <p className="rounded-lg border border-dashed border-border bg-bg/60 p-4 text-sm text-muted">
          Jugadores en proceso de registro.
        </p>
      ) : (
        <>
          <details
            className="group overflow-hidden rounded-lg border border-border bg-bg/70 open:bg-bg-elevated/60"
            open={players.length > 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-surface sm:px-5 [&::-webkit-details-marker]:hidden">
              <span className="text-sm font-black uppercase tracking-normal text-text">
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

          {(convocados.length > 0 || canManage) && (
            <details className="group overflow-hidden rounded-lg border border-border bg-bg/70 open:bg-bg-elevated/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-surface sm:px-5 [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-black uppercase tracking-normal text-text">
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
          )}
        </>
      )}
    </div>
  );
}

export { playersFromSection };
