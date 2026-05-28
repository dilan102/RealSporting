"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Player } from "@/lib/content";
import { fadeUpItem } from "@/lib/motion";

export function PlayerCard({ player }: { player: Player }) {
  const [loaded, setLoaded] = useState(false);
  const age = useMemo(() => {
    const categoryYear = Number(String(player.category).split("-")[0]);
    const currentYear = new Date().getFullYear();
    return Number.isFinite(categoryYear) ? Math.max(currentYear - categoryYear, 6) : null;
  }, [player.category]);

  return (
    <motion.article
      variants={fadeUpItem}
      className="glass group overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {!loaded && <div className="skeleton absolute inset-0 animate-pulse" aria-hidden="true" />}
        <Image
          src={player.image}
          alt={player.name}
          fill
          className={`object-cover object-top transition-all duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
        />
        <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-bg/90 text-lg font-bold text-accent backdrop-blur">
          {player.number}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-secondary">
          {player.position}
        </p>
        <h3 className="mt-1 text-lg font-bold">{player.name}</h3>
        <div className="mt-3 grid gap-2 text-xs font-semibold text-muted">
          <p>Edad: {age ? `${age} años` : "N/D"}</p>
          <p>Categoria: {String(player.category)}</p>
          <p>Estado: {player.convocado === "SI" ? "Convocado" : "En entrenamiento"}</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{player.bio}</p>
      </div>
    </motion.article>
  );
}
