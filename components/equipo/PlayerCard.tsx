"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Player } from "@/lib/content";
import { fadeUpItem } from "@/lib/motion";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <motion.article
      variants={fadeUpItem}
      className="glass group overflow-hidden rounded-lg transition-colors duration-300 hover:border-accent/30"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={player.image}
          alt={player.name}
          fill
          className="object-cover"
        />
        <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg bg-bg/90 text-lg font-bold text-accent backdrop-blur">
          {player.number}
        </span>
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-secondary">
          {player.position}
        </p>
        <h3 className="mt-1 text-lg font-bold">{player.name}</h3>
        <p className="mt-2 text-sm text-muted">{player.bio}</p>
      </div>
    </motion.article>
  );
}
