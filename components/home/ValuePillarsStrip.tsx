"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { club } from "@/lib/content";
import { PRELOADER_EASE } from "@/lib/preloader";

export function ValuePillarsStrip() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border">
      {club.values.slice(0, 4).map((value, index) => {
        const open = expanded === value.title;

        return (
          <motion.article
            key={value.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, duration: 0.4, ease: PRELOADER_EASE }}
            className={`mobile-card-lift bg-bg-elevated transition-all duration-300 ${
              open
                ? "ring-2 ring-inset ring-accent shadow-lg shadow-[var(--accent-gold)]/12"
                : "hover:bg-bg hover:shadow-md"
            }`}
          >
            <button
              type="button"
              onClick={() => setExpanded(open ? null : value.title)}
              className="group w-full p-6 text-left"
              aria-expanded={open}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-black text-accent transition-colors group-hover:text-accent-secondary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-muted transition-transform duration-300 ${
                    open ? "rotate-180 text-accent" : "group-hover:text-accent"
                  }`}
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-2 text-2xl font-black transition-transform duration-300 group-hover:translate-x-0.5">
                {value.title}
              </h3>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.p
                    key="detail"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: PRELOADER_EASE }}
                    className="mt-3 overflow-hidden text-sm leading-7 text-muted"
                  >
                    {value.description}
                  </motion.p>
                ) : (
                  <motion.p
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 line-clamp-2 text-sm leading-7 text-muted group-hover:text-text"
                  >
                    {value.description}
                  </motion.p>
                )}
              </AnimatePresence>
              <span className="mt-4 inline-flex text-xs font-black uppercase tracking-normal text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {open ? "Cerrar" : "Ver más"}
              </span>
            </button>
          </motion.article>
        );
      })}
    </div>
  );
}
