"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import type { News } from "@/lib/content";
import { fadeUpItem } from "@/lib/motion";

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  item: News;
  canManage?: boolean;
  onEdit?: (item: News) => void;
  onDelete?: (id: string) => void;
};

export function NewsCard({ item, canManage = false, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      variants={fadeUpItem}
      className={`mobile-card-lift overflow-hidden rounded-lg border border-border bg-bg-elevated text-text shadow-sm transition-all duration-300 hover:border-accent/50 ${
        expanded ? "sm:col-span-2 lg:col-span-3" : ""
      }`}
    >
      <div
        className={`grid gap-0 ${
          expanded ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]" : ""
        }`}
      >
        <div className="relative aspect-[16/10] min-h-64 overflow-hidden">
          <Image src={item.image} alt={item.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-lg bg-bg-elevated px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-accent shadow-sm">
            {item.category}
          </span>
        </div>
        <div className="p-6">
          <time className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
            {formatDate(item.date)}
          </time>
          <h3 className="mt-3 text-xl font-black leading-tight">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {item.summary}
          </p>
          <p
            className={`mt-4 text-sm leading-7 text-muted transition-all ${
              expanded ? "block" : "line-clamp-3"
            }`}
          >
            {item.body}
          </p>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mt-5 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-accent transition-colors hover:text-text"
          >
            {expanded ? "Contraer noticia" : "Leer noticia completa"}
            <ChevronDown
              size={14}
              aria-hidden="true"
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
          {canManage && (
            <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => onEdit?.(item)}
                className="inline-flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/10 px-4 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/15"
              >
                <Pencil size={14} aria-hidden="true" />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(item.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-500/15"
              >
                <Trash2 size={14} aria-hidden="true" />
                Borrar
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
