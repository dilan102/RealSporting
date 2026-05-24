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
