"use client";

import type { News } from "@/lib/content";
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
    <div className="stagger-container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <NewsCard
          key={item.id}
          item={item}
          canManage={canManage}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
