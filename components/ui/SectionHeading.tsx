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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-80px" }}
      variants={fadeUpItem}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="font-institutional kinetic-heading text-3xl font-black tracking-normal sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
      )}
    </motion.div>
  );
}
