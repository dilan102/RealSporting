"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import type { News } from "@/lib/content";
import { fadeUpItem } from "@/lib/motion";
import { NewsBadge, NewsVisual } from "./NewsVisual";

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
  return (
    <motion.article
      variants={fadeUpItem}
      className="mobile-card-lift group overflow-hidden rounded-lg border border-border bg-bg-elevated text-text shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-[var(--accent-gold)]/15"
    >
      <Link href={`/noticias/${item.id}`} className="block">
        <div className="relative aspect-[16/10] min-h-64 overflow-hidden">
          <NewsVisual item={item} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute left-4 top-4">
            <NewsBadge category={item.category} />
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
          <span className="mt-5 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.12em] text-accent transition-colors group-hover:text-text">
            Leer noticia completa
            <ArrowRight size={14} aria-hidden="true" />
          </span>
        </div>
      </Link>
      {canManage && (
        <div className="mx-6 mb-6 flex flex-wrap gap-2 border-t border-border pt-4">
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
    </motion.article>
  );
}
