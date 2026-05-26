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
