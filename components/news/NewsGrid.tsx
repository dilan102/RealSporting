"use client";

import { motion } from "framer-motion";
import type { News } from "@/lib/content";
import { staggerContainer } from "@/lib/motion";
import { NewsCard } from "./NewsCard";

type Props = {
  items: News[];
  canManage?: boolean;
  onEdit?: (item: News) => void;
  onDelete?: (id: string) => void;
};

export function NewsGrid({ items, canManage = false, onEdit, onDelete }: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-bg-elevated p-6 text-center">
        <p className="text-sm font-semibold text-text">
          No hay noticias publicadas por ahora.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Las actualizaciones aparecerán aquí cuando el administrador las publique.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-40px" }}
    >
      {items.map((item) => (
        <NewsCard
          key={item.id}
          item={item}
          canManage={canManage}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </motion.div>
  );
}
