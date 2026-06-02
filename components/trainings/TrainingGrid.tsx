"use client";

import { motion } from "framer-motion";
import type { Training } from "@/lib/content";
import { staggerContainer } from "@/lib/motion";
import { TrainingCard } from "./TrainingCard";

type TrainingGridProps = {
  items: Training[];
  canManage?: boolean;
  onEdit?: (training: Training) => void;
  onDelete?: (id: string) => void;
};

export function TrainingGrid({
  items,
  canManage = false,
  onEdit,
  onDelete,
}: TrainingGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-bg-elevated p-6 text-center">
        <p className="text-sm font-semibold text-text">
          No hay entrenamientos publicados por ahora.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          El registro aparecerá aquí cuando el administrador publique fotos o videos.
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
      {items.map((training) => (
        <TrainingCard
          key={training.id}
          training={training}
          canManage={canManage}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </motion.div>
  );
}
