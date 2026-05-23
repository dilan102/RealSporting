"use client";

import { motion } from "framer-motion";
import { fadeUpItem } from "@/lib/motion";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: Props) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <motion.div
      className={`max-w-2xl ${alignClass}`}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUpItem}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
      )}
    </motion.div>
  );
}
