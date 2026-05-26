"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Pencil, Plus, UsersRound } from "lucide-react";
import type { Player, TeamCategoryId, TeamSection } from "@/lib/content";
import { fadeUpItem, staggerContainer } from "@/lib/motion";

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
          <div className="border-b border-border bg-bg-elevated/50 px-5 py-5 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-secondary">
              Categoría
            </p>
            <h3 className="mt-1 text-2xl font-bold">{section.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {section.description}
            </p>
          </div>

          <div className="space-y-4 p-4 sm:p-6">
            {section.groups.map((group) => {
              const occupiedSlots = group.slots.filter((slot) => slot.player).length;
              const playerSlots = group.slots.filter((slot) => slot.player);
              const isPlayersGroup = group.id.endsWith("-jugadores");

              return (
                <details
                  key={group.id}
                  className="group overflow-hidden rounded-lg border border-border bg-bg/70 transition-colors duration-300 open:bg-bg-elevated/60"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 transition-colors duration-300 hover:bg-surface sm:px-5 [&::-webkit-details-marker]:hidden">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
                        <UsersRound size={20} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-base font-bold text-text sm:text-lg">
                          {group.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                          {group.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="rounded-lg border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold text-accent sm:text-sm">
                        {occupiedSlots}/{group.slots.length}
                      </span>
                      <ChevronDown
                        className="text-muted transition-transform duration-300 group-open:rotate-180"
                        size={22}
                        aria-hidden="true"
                      />
                    </div>
                  </summary>

                  <div className="border-t border-border bg-bg/65 p-3 sm:p-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {playerSlots.length === 0 && (
                        <div className="flex min-h-36 items-center justify-center rounded-lg border border-dashed border-border bg-bg-elevated/40 p-4 text-center sm:col-span-2 lg:col-span-4">
                          <p className="text-sm font-semibold text-muted">
                            En reclutamiento de categoria
                          </p>
                        </div>
                      )}

                      {playerSlots.map((slot, index) => {
                        const player = slot.player;
                        const initials = player?.name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase();

                        return (
                          <article
                            key={slot.id}
                            className="relative min-h-36 rounded-lg border border-border bg-bg-elevated/60 p-4 transition-colors duration-300 hover:border-accent/30 hover:bg-bg-elevated"
                          >
                            {canManage && player && (
                              <button
                                type="button"
                                onClick={() => onEditPlayer?.(player)}
                                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-bg/90 text-muted transition-colors hover:border-accent/50 hover:text-accent"
                                aria-label={`Editar ${player.name}`}
                              >
                                <Pencil size={15} aria-hidden="true" />
                              </button>
                            )}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 items-center gap-3 pr-8">
                                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface text-sm font-bold text-accent">
                                  {player?.image ? (
                                    <Image
                                      src={player.image}
                                      alt={player.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    initials || String(index + 1).padStart(2, "0")
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                                    Cupo {String(index + 1).padStart(2, "0")}
                                  </p>
                                  <h5 className="mt-1 truncate text-base font-bold">
                                    {player?.name || "Disponible"}
                                  </h5>
                                </div>
                              </div>
                              {player && (
                                <span className="rounded-lg bg-accent/10 px-2 py-1 text-xs font-bold text-accent">
                                  #{player.number}
                                </span>
                              )}
                            </div>
                            <div className="mt-4 border-t border-border pt-3">
                              <p className="text-sm font-semibold text-accent-secondary">
                                {player?.position || "Por definir"}
                              </p>
                              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                                {player?.bio || "Espacio listo para añadir integrante."}
                              </p>
                            </div>
                          </article>
                        );
                      })}

                      {canManage && isPlayersGroup && (
                        <button
                          type="button"
                          onClick={() => onAddPlayer?.(section.id as TeamCategoryId)}
                          className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-accent/40 bg-accent/5 p-4 text-center transition-colors duration-300 hover:border-accent hover:bg-accent/10"
                        >
                          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                            <Plus size={22} aria-hidden="true" />
                          </span>
                          <span className="mt-3 text-base font-bold text-text">
                            Añadir jugador
                          </span>
                          <span className="mt-1 text-sm text-muted">
                            Registrar en {section.title}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </motion.section>
      ))}
    </motion.div>
  );
}
