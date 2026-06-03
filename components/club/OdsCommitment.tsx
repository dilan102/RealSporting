"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { OdsItem } from "@/lib/content";
import { odsClosingPhrase, odsItems } from "@/lib/content";
import { PRELOADER_EASE } from "@/lib/preloader";
import { OdsFlipCard } from "@/components/club/OdsFlipCard";
import { OdsInfographicModal } from "@/components/club/OdsInfographicModal";

export function OdsCommitment() {
  const [infographicItem, setInfographicItem] = useState<OdsItem | null>(null);

  return (
    <>
      <div className="space-y-10">
        <p className="text-sm text-muted">
          Haz clic en cualquier ODS para voltear la tarjeta y abrir la infografía oficial en PDF o
          imagen.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {odsItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-4%" }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: PRELOADER_EASE }}
            >
              <OdsFlipCard
                item={item}
                variant="club"
                onOpenInfographic={setInfographicItem}
              />
            </motion.div>
          ))}
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: PRELOADER_EASE }}
          className="rounded-lg border border-accent/30 bg-[color-mix(in_srgb,var(--accent-gold)_10%,var(--bg-elevated))] px-6 py-8 text-center sm:px-10"
        >
          <p className="font-social-impact text-balance text-2xl font-black leading-snug text-text sm:text-3xl">
            {odsClosingPhrase}
          </p>
          <p className="mt-3 text-xs font-black uppercase tracking-normal text-muted">
            Club Deportivo Real Sporting · Compromiso con los ODS
          </p>
        </motion.blockquote>
      </div>

      <OdsInfographicModal
        item={infographicItem}
        onClose={() => setInfographicItem(null)}
      />
    </>
  );
}
