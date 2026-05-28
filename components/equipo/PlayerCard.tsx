"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Player } from "@/lib/content";
import { fadeUpItem } from "@/lib/motion";

type PlayerCardProps = {
  player: Player;
};

export function PlayerCard({ player }: PlayerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const age = useMemo(() => {
    const categoryYear = Number(String(player.category).split("-")[0]);
    const currentYear = new Date().getFullYear();
    return Number.isFinite(categoryYear) ? Math.max(currentYear - categoryYear, 6) : null;
  }, [player.category]);

  const isConvocado = player.convocado === "SI";

  return (
    <motion.article
      variants={fadeUpItem}
      className={`overflow-hidden rounded-lg border bg-bg-elevated/80 transition-all duration-300 ${
        expanded
          ? "border-accent shadow-lg shadow-[var(--accent-gold)]/10"
          : "border-border hover:border-accent/35"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="w-full text-left"
        aria-expanded={expanded}
        aria-label={`${expanded ? "Ocultar" : "Ver"} ficha de ${player.name}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          {!loaded && <div className="skeleton absolute inset-0 animate-pulse" aria-hidden="true" />}
          <Image
            src={player.image}
            alt={player.name}
            fill
            sizes="(min-width: 1024px) 180px, 33vw"
            className={`object-cover object-top transition-all duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${expanded ? "scale-105" : ""}`}
            onLoad={() => setLoaded(true)}
          />
          <span className="absolute left-2 top-2 rounded-md bg-bg/90 px-2 py-0.5 text-xs font-black text-accent backdrop-blur">
            #{player.number}
          </span>
          {isConvocado && (
            <span className="absolute right-2 top-2 rounded-md bg-accent px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--button-text)]">
              Convocado
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-2 p-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-accent-secondary">
              {player.position}
            </p>
            <h3 className="truncate text-sm font-bold">{player.name}</h3>
          </div>
          <ChevronDown
            size={16}
            className={`mt-1 shrink-0 text-muted transition-transform duration-300 ${expanded ? "rotate-180 text-accent" : ""}`}
            aria-hidden="true"
          />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-2 border-t border-border px-3 pb-3 pt-1 text-xs leading-relaxed text-muted">
            <p>
              <span className="font-semibold text-text">Edad estimada:</span>{" "}
              {age ? `${age} años` : "No registrada"}
            </p>
            <p>
              <span className="font-semibold text-text">Año de proceso:</span> {String(player.category)}
            </p>
            <p>
              <span className="font-semibold text-text">Estado competitivo:</span>{" "}
              {isConvocado ? "Convocado para competencia" : "En formación"}
            </p>
            <p className="pt-1 text-sm leading-6">{player.bio}</p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
