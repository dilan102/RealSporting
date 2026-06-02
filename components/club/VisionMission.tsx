"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Eye,
  Flag,
  HeartHandshake,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { club } from "@/lib/content";
import { PRELOADER_EASE } from "@/lib/preloader";

const cards = [
  {
    icon: Target,
    title: "Misión",
    text: club.mission,
    image: "/brand/gallery-team.jpg",
  },
  {
    icon: Eye,
    title: "Visión",
    text: club.vision,
    image: "/brand/hero-training.jpg",
  },
];

const valueIcons = [ShieldCheck, Users, Target, HeartHandshake, Flag];

export function VisionMission() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {cards.map(({ icon: Icon, title, text, image }, index) => (
        <motion.article
          key={title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15, duration: 0.4, ease: PRELOADER_EASE }}
          className="alive-card mobile-card-lift group overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-sm transition-colors duration-300 hover:border-accent/40"
        >
          <div className="relative aspect-[16/9] bg-surface">
            <Image
              src={image}
              alt={title}
              fill
              className="interactive-image object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-lg bg-accent text-[var(--button-text)]">
              <Icon size={22} aria-hidden="true" />
            </span>
          </div>
          <div className="p-6">
            <h3 className="font-institutional text-3xl font-black">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export function ValuesGrid() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      {club.values.map((value, index) => {
        const Icon = valueIcons[index] || Flag;

        return (
          <motion.article
            key={value.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.4, ease: PRELOADER_EASE }}
            className="alive-card mobile-card-lift group relative overflow-hidden rounded-lg border border-border bg-bg-elevated p-7 transition-all duration-300 hover:border-accent hover:bg-[color-mix(in_srgb,var(--accent-green)_9%,var(--card-bg))]"
          >
            <span className="pointer-events-none absolute right-5 top-3 font-display text-7xl leading-none text-[color-mix(in_srgb,var(--accent-gold)_20%,transparent)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="mb-6 grid size-14 place-items-center rounded-lg bg-accent/15 text-accent">
              <Icon size={44} aria-hidden="true" strokeWidth={1.6} />
            </div>
            <h3 className="font-social-impact relative text-3xl font-black">{value.title}</h3>
            <p className="relative mt-3 text-sm leading-7 text-muted">{value.description}</p>
          </motion.article>
        );
      })}
    </div>
  );
}

export function Timeline() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {club.milestones.map((m, index) => (
        <motion.li
          key={`${m.year}-${m.event}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2, duration: 0.4, ease: PRELOADER_EASE }}
          className="alive-card mobile-card-lift rounded-lg border border-border bg-bg-elevated p-5"
        >
          <p className="font-training text-lg font-black text-accent">{m.year}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{m.event}</p>
        </motion.li>
      ))}
    </ol>
  );
}

