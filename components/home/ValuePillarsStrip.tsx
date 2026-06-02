"use client";

import { motion } from "framer-motion";
import { club } from "@/lib/content";
import { PRELOADER_EASE } from "@/lib/preloader";

export function ValuePillarsStrip() {
  return (
    <div className="mobile-snap-x mobile-scrollbar-none grid gap-px overflow-hidden rounded-lg border border-border bg-border">
      {club.values.slice(0, 4).map((value, index) => (
        <motion.article
          key={value.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15, duration: 0.4, ease: PRELOADER_EASE }}
          className="mobile-card-lift bg-bg-elevated p-6"
        >
          <p className="text-sm font-black text-accent">{String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-2 text-2xl font-black">{value.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{value.description}</p>
        </motion.article>
      ))}
    </div>
  );
}
